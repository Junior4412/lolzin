import { NextRequest, NextResponse } from "next/server";
import { 
  PlayerDashboardData, 
  getCachedPlayerData, 
  setCachedPlayerData,
  MatchHistoryItem,
  ChampionStats
} from "@/lib/riot";

const REGION_MAPPING: Record<string, { platform: string; regional: string }> = {
  br: { platform: "br1", regional: "americas" },
  na: { platform: "na1", regional: "americas" },
  euw: { platform: "euw1", regional: "europe" },
  eune: { platform: "eun1", regional: "europe" },
  kr: { platform: "kr", regional: "asia" },
  jp: { platform: "jp1", regional: "asia" },
  las: { platform: "la2", regional: "americas" },
  lan: { platform: "la1", regional: "americas" },
  oce: { platform: "oc1", regional: "sea" },
  tr: { platform: "tr1", regional: "europe" },
  ru: { platform: "ru", regional: "europe" }
};

// Mapeamentos para conversão de IDs da API da Riot para nomes amigáveis
const KEYSTONE_MAPPING: Record<number, { name: string; primary: string }> = {
  8005: { name: "Press the Attack", primary: "Precision" },
  8008: { name: "Lethal Tempo", primary: "Precision" },
  8021: { name: "Fleet Footwork", primary: "Precision" },
  8010: { name: "Conqueror", primary: "Precision" },
  8112: { name: "Electrocute", primary: "Domination" },
  8124: { name: "Predator", primary: "Domination" },
  8128: { name: "Dark Harvest", primary: "Domination" },
  9923: { name: "Hail of Blades", primary: "Domination" },
  8214: { name: "Summon Aery", primary: "Sorcery" },
  8229: { name: "Arcane Comet", primary: "Sorcery" },
  8230: { name: "Phase Rush", primary: "Sorcery" },
  8437: { name: "Grasp of the Undying", primary: "Resolve" },
  8439: { name: "Aftershock", primary: "Resolve" },
  8465: { name: "Guardian", primary: "Resolve" },
  8351: { name: "Glacial Augment", primary: "Inspiration" },
  8360: { name: "Unsealed Spellbook", primary: "Inspiration" },
  8369: { name: "First Strike", primary: "Inspiration" }
};

const SPELL_MAPPING: Record<number, string> = {
  21: "SummonerBarrier",
  1: "SummonerBoost",
  14: "SummonerDot",
  3: "SummonerExhaust",
  4: "SummonerFlash",
  6: "SummonerHaste",
  7: "SummonerHeal",
  11: "SummonerSmite",
  12: "SummonerTeleport"
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const riotId = searchParams.get("riotId");
    const region = searchParams.get("region")?.toLowerCase() || "br";

    if (!riotId || !riotId.includes("#")) {
      return NextResponse.json(
        { error: "Riot ID inválido. Deve conter Nome e Tag separados por '#'. Ex: Junin#BR1" },
        { status: 400 }
      );
    }

    const [gameName, tagLine] = riotId.split("#");
    
    // Tenta obter dados do cache
    const cachedData = getCachedPlayerData(gameName, tagLine, region);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const apiKey = process.env.RIOT_API_KEY;

    // NUNCA inventar estatisticas de jogador real. Sem uma RIOT_API_KEY configurada, a resposta
    // correta e um erro explicito - nao um perfil fabricado que parece real (elo, LP, winrate
    // gerados por hash nao sao dado real e nao devem ser servidos como se fossem).
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Integracao com a Riot API ainda nao configurada neste ambiente (falta a variavel RIOT_API_KEY). Nenhum dado e exibido porque nao inventamos estatisticas de jogador.",
          code: "riot_api_not_configured"
        },
        { status: 501 }
      );
    }

    // Fluxo da API Oficial da Riot
    const config = REGION_MAPPING[region];
    if (!config) {
      return NextResponse.json({ error: "Região não suportada." }, { status: 400 });
    }

    const headers = { "X-Riot-Token": apiKey };

    // 1. Resolver Riot ID para PUUID
    const accountUrl = `https://${config.regional}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
    const accountRes = await fetch(accountUrl, { headers });

    if (!accountRes.ok) {
      if (accountRes.status === 404) {
        return NextResponse.json({ error: "Jogador não encontrado na Riot Games." }, { status: 404 });
      }
      throw new Error(`Erro na API de Contas da Riot: ${accountRes.status}`);
    }

    const account = await accountRes.json();
    const puuid = account.puuid;
    const resolvedName = account.gameName || gameName;
    const resolvedTag = account.tagLine || tagLine;

    // 2. Buscar Dados do Invocador (Nível e Ícone)
    const summonerUrl = `https://${config.platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    const summonerRes = await fetch(summonerUrl, { headers });
    if (!summonerRes.ok) {
      throw new Error(`Erro na API de Invocadores da Riot: ${summonerRes.status}`);
    }
    const summoner = await summonerRes.json();
    const summonerId = summoner.id;

    // 3. Buscar Elo (League-V4)
    const leagueUrl = `https://${config.platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
    const leagueRes = await fetch(leagueUrl, { headers });
    let tier = "UNRANKED";
    let rank = "";
    let lp = 0;
    let wins = 0;
    let losses = 0;

    if (leagueRes.ok) {
      const leagues = await leagueRes.json();
      // Prioriza Ranked Solo/Duo, depois Ranked Flex
      const queue = leagues.find((l: any) => l.queueType === "RANKED_SOLO_5x5") || 
                    leagues.find((l: any) => l.queueType === "RANKED_FLEX_SR");
      if (queue) {
        tier = queue.tier;
        rank = queue.rank;
        lp = queue.leaguePoints;
        wins = queue.wins;
        losses = queue.losses;
      }
    }

    const totalGames = wins + losses;
    const winRate = totalGames > 0 ? Number(((wins / totalGames) * 100).toFixed(1)) : 0;

    const profile: PlayerDashboardData["profile"] = {
      name: resolvedName,
      tag: resolvedTag,
      region: region.toUpperCase(),
      level: summoner.summonerLevel,
      profileIconId: summoner.profileIconId,
      tier,
      rank,
      leaguePoints: lp,
      wins,
      losses,
      winRate
    };

    // 4. Buscar últimas 10 Partidas
    const matchesUrl = `https://${config.regional}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`;
    const matchesRes = await fetch(matchesUrl, { headers });
    let matchIds: string[] = [];
    if (matchesRes.ok) {
      matchIds = await matchesRes.json();
    }

    // 5. Buscar detalhes das partidas em paralelo
    const matchHistory: MatchHistoryItem[] = [];
    const championGames: Record<string, { name: string; games: number; wins: number; kills: number; deaths: number; assists: number }> = {};
    
    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;
    let totalGold = 0;
    let totalMinions = 0;
    let totalDuration = 0;
    let totalDamageDealt = 0;
    let totalDamageTaken = 0;
    let totalWardsPlaced = 0;
    let totalWardsDestroyed = 0;
    let totalKp = 0;

    if (matchIds.length > 0) {
      const matchPromises = matchIds.map(async (id) => {
        try {
          const res = await fetch(`https://${config.regional}.api.riotgames.com/lol/match/v5/matches/${id}`, { headers });
          if (res.ok) return await res.json();
        } catch (e) {
          console.error(`Falha ao carregar partida ${id}:`, e);
        }
        return null;
      });

      const matchesDetails = (await Promise.all(matchPromises)).filter(Boolean);

      for (const match of matchesDetails) {
        if (!match.info || !match.metadata) continue;
        
        // Acha o participante
        const participant = match.info.participants.find((p: any) => p.puuid === puuid);
        if (!participant) continue;

        const duration = match.info.gameDuration; // em segundos
        const win = participant.win;
        const kills = participant.kills;
        const deaths = participant.deaths;
        const assists = participant.assists;
        const championId = participant.championName; // O DDragon usa o nome como ID de imagem (ex: "Aatrox")
        const championName = participant.championName;
        
        // Converte lane
        let lane: MatchHistoryItem["lane"] = "MID";
        const role = participant.individualPosition || participant.teamPosition;
        if (role === "TOP") lane = "TOP";
        else if (role === "JUNGLE") lane = "JUNGLE";
        else if (role === "MIDDLE") lane = "MID";
        else if (role === "BOTTOM") lane = "ADC";
        else if (role === "UTILITY") lane = "SUPPORT";

        // Acumuladores globais
        totalKills += kills;
        totalDeaths += deaths;
        totalAssists += assists;
        totalGold += participant.goldEarned;
        totalMinions += participant.totalMinionsKilled + (participant.neutralMinionsKilled || 0);
        totalDuration += duration;
        totalDamageDealt += participant.totalDamageDealtToChampions;
        totalDamageTaken += participant.totalDamageTaken;
        totalWardsPlaced += participant.wardsPlaced || 0;
        totalWardsDestroyed += participant.wardsKilled || 0;

        // Participação em kills
        const teamId = participant.teamId;
        const team = match.info.teams.find((t: any) => t.teamId === teamId);
        const teamKills = match.info.participants
          .filter((p: any) => p.teamId === teamId)
          .reduce((sum: number, p: any) => sum + p.kills, 0);
        const matchKp = teamKills > 0 ? ((kills + assists) / teamKills) * 100 : 0;
        totalKp += matchKp;

        // Acumuladores por campeão
        if (!championGames[championId]) {
          championGames[championId] = {
            name: championName,
            games: 0,
            wins: 0,
            kills: 0,
            deaths: 0,
            assists: 0
          };
        }
        championGames[championId].games += 1;
        if (win) championGames[championId].wins += 1;
        championGames[championId].kills += kills;
        championGames[championId].deaths += deaths;
        championGames[championId].assists += assists;

        // Itens
        const items = [
          participant.item0.toString(),
          participant.item1.toString(),
          participant.item2.toString(),
          participant.item3.toString(),
          participant.item4.toString(),
          participant.item5.toString()
        ].filter(id => id !== "0");

        const trinket = participant.item6.toString();

        // Runas
        const keystoneId = participant.perks?.styles?.[0]?.selections?.[0]?.perk;
        const styleId = participant.perks?.styles?.[0]?.style;
        const keystone = KEYSTONE_MAPPING[keystoneId]?.name || "Desconhecido";
        const primaryStyle = KEYSTONE_MAPPING[keystoneId]?.primary || "Runas";

        // Spells
        const spells = [
          SPELL_MAPPING[participant.summoner1Id] || "SummonerFlash",
          SPELL_MAPPING[participant.summoner2Id] || "SummonerDot"
        ];

        matchHistory.push({
          matchId: match.metadata.matchId,
          championId,
          championName,
          win,
          kills,
          deaths,
          assists,
          duration,
          lane,
          items,
          trinket,
          spells,
          runes: {
            keystone,
            primaryStyle,
            keystoneId,
            primaryStyleId: styleId
          },
          timestamp: match.info.gameCreation
        });
      }
    }

    // Formatar médias das últimas 10 partidas
    const totalMatchesCount = matchHistory.length || 1;
    const avgKills = Number((totalKills / totalMatchesCount).toFixed(1));
    const avgDeaths = Number((totalDeaths / totalMatchesCount).toFixed(1));
    const avgAssists = Number((totalAssists / totalMatchesCount).toFixed(1));
    const avgKdaRatio = Number(((avgKills + avgAssists) / Math.max(1, avgDeaths)).toFixed(2)).toFixed(2);
    
    const csMin = Number(((totalMinions / totalDuration) * 60).toFixed(1)) || 0;
    const goldMin = Math.round((totalGold / totalDuration) * 60) || 0;
    const avgDamageDealt = Math.round(totalDamageDealt / totalMatchesCount);
    const avgDamageTaken = Math.round(totalDamageTaken / totalMatchesCount);
    const avgDuration = Math.round(totalDuration / totalMatchesCount);
    const avgWardsPlaced = Math.round(totalWardsPlaced / totalMatchesCount);
    const avgWardsDestroyed = Math.round(totalWardsDestroyed / totalMatchesCount);
    const avgKp = Math.round(totalKp / totalMatchesCount);

    const stats: PlayerDashboardData["stats"] = {
      kda: {
        kills: avgKills,
        deaths: avgDeaths,
        assists: avgAssists,
        ratio: avgKdaRatio
      },
      kp: avgKp,
      csMin,
      goldMin,
      damageDealt: avgDamageDealt,
      damageTaken: avgDamageTaken,
      averageDuration: avgDuration,
      wardsPlaced: avgWardsPlaced,
      wardsDestroyed: avgWardsDestroyed
    };

    // Formatar estatísticas dos campeões baseadas no histórico buscado
    const championsList: ChampionStats[] = Object.entries(championGames).map(([id, data]) => {
      const wins = data.wins;
      const games = data.games;
      const losses = games - wins;
      const winRate = Number(((wins / games) * 100).toFixed(1));
      const kills = Number((data.kills / games).toFixed(1));
      const deaths = Number((data.deaths / games).toFixed(1));
      const assists = Number((data.assists / games).toFixed(1));
      const kdaRatio = Number(((kills + assists) / Math.max(1, deaths)).toFixed(2)).toFixed(2);

      return {
        championId: id,
        championName: data.name,
        games,
        wins,
        losses,
        winRate,
        kills,
        deaths,
        assists,
        kdaRatio
      };
    }).sort((a, b) => b.games - a.games);

    const fullData: PlayerDashboardData = {
      profile,
      stats,
      champions: championsList,
      history: matchHistory.sort((a, b) => b.timestamp - a.timestamp)
    };

    setCachedPlayerData(gameName, tagLine, region, fullData);

    return NextResponse.json(fullData);
  } catch (error: any) {
    console.error("Erro geral na rota do jogador:", error);
    return NextResponse.json(
      { error: `Erro ao buscar invocador: ${error.message || "Erro desconhecido"}` },
      { status: 500 }
    );
  }
}

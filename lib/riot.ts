export interface PlayerProfile {
  name: string;
  tag: string;
  region: string;
  level: number;
  profileIconId: number;
  tier: string; // e.g. "DIAMOND"
  rank: string; // e.g. "I"
  leaguePoints: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface PlayerStats {
  kda: {
    kills: number;
    deaths: number;
    assists: number;
    ratio: string;
  };
  kp: number; // %
  csMin: number;
  goldMin: number;
  damageDealt: number;
  damageTaken: number;
  averageDuration: number; // seconds
  wardsPlaced: number;
  wardsDestroyed: number;
}

export interface ChampionStats {
  championId: string;
  championName: string;
  games: number;
  wins: number;
  losses: number;
  winRate: number;
  kills: number;
  deaths: number;
  assists: number;
  kdaRatio: string;
}

export interface MatchHistoryItem {
  matchId: string;
  championId: string;
  championName: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  duration: number; // seconds
  lane: "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";
  items: string[]; // 6 items
  trinket: string; // 1 trinket
  spells: string[]; // 2 spells
  runes: {
    keystone: string;
    primaryStyle: string;
    keystoneId?: number;
    primaryStyleId?: number;
  };
  timestamp: number; // epoch ms
}

export interface PlayerDashboardData {
  profile: PlayerProfile;
  stats: PlayerStats;
  champions: ChampionStats[];
  history: MatchHistoryItem[];
}

// Lista de campeões comuns para geração de mock e fallback
const MOCK_CHAMPIONS = [
  { id: "Aatrox", name: "Aatrox", tag: "Fighter" },
  { id: "Ahri", name: "Ahri", tag: "Mage" },
  { id: "Akali", name: "Akali", tag: "Assassin" },
  { id: "Ashe", name: "Ashe", tag: "Marksman" },
  { id: "Blitzcrank", name: "Blitzcrank", tag: "Support" },
  { id: "Caitlyn", name: "Caitlyn", tag: "Marksman" },
  { id: "Darius", name: "Darius", tag: "Fighter" },
  { id: "Ekko", name: "Ekko", tag: "Assassin" },
  { id: "Ezreal", name: "Ezreal", tag: "Marksman" },
  { id: "Garen", name: "Garen", tag: "Fighter" },
  { id: "Hwei", name: "Hwei", tag: "Mage" },
  { id: "Jhin", name: "Jhin", tag: "Marksman" },
  { id: "Jinx", name: "Jinx", tag: "Marksman" },
  { id: "Kaisa", name: "Kai'Sa", tag: "Marksman" },
  { id: "LeeSin", name: "Lee Sin", tag: "Fighter" },
  { id: "Leona", name: "Leona", tag: "Tank" },
  { id: "Lux", name: "Lux", tag: "Mage" },
  { id: "Malphite", name: "Malphite", tag: "Tank" },
  { id: "MissFortune", name: "Miss Fortune", tag: "Marksman" },
  { id: "Morgana", name: "Morgana", tag: "Support" },
  { id: "Nautilus", name: "Nautilus", tag: "Tank" },
  { id: "Pyke", name: "Pyke", tag: "Assassin" },
  { id: "Riven", name: "Riven", tag: "Fighter" },
  { id: "Senna", name: "Senna", tag: "Support" },
  { id: "Sett", name: "Sett", tag: "Fighter" },
  { id: "Sylas", name: "Sylas", tag: "Mage" },
  { id: "Thresh", name: "Thresh", tag: "Support" },
  { id: "Vayne", name: "Vayne", tag: "Marksman" },
  { id: "Viego", name: "Viego", tag: "Fighter" },
  { id: "Yasuo", name: "Yasuo", tag: "Fighter" },
  { id: "Yone", name: "Yone", tag: "Fighter" },
  { id: "Zed", name: "Zed", tag: "Assassin" }
];

const MOCK_ITEMS_BY_ROLE: Record<string, string[]> = {
  Marksman: ["3031", "3046", "3094", "3072", "3035", "3026", "3153", "6672"], // Infinity Edge, Phantom Dancer, Rapid Firecannon, Bloodthirster, LDR, Guardian Angel, Botrk, Kraken
  Mage: ["3089", "3157", "3135", "3128", "3165", "3001", "6655", "3020"], // Rabadon, Zhonya, Void Staff, Ludens, Morello, Abyssal, Liandry, Sorc Shoes
  Assassin: ["3179", "3156", "3158", "3814", "6676", "6692", "6695", "6696"], // Umbral, Maw, Ionian, Edge of Night, Collector, Ghostblade, Serylda, Opportunity
  Fighter: ["3053", "3078", "3071", "3053", "6333", "3161", "3158", "3026"], // Sterak, Trinity, Black Cleaver, Sundered Sky, Shojin, Ionian, GA
  Tank: ["3075", "3068", "3109", "3001", "3110", "3111", "3083", "4301"], // Thornmail, Sunfire, Knight's Vow, Jak'Sho, Heartsteel, Warmog
  Support: ["3190", "3107", "3222", "3110", "3504", "3114", "3158", "3801"] // Locket, Redemption, Mikael, Warmog, Ardent, Shurelya, Ionian
};

const RUNES_KEYSTONES = [
  { name: "Conqueror", primary: "Precision" },
  { name: "Press the Attack", primary: "Precision" },
  { name: "Lethal Tempo", primary: "Precision" },
  { name: "Fleet Footwork", primary: "Precision" },
  { name: "Electrocute", primary: "Domination" },
  { name: "Dark Harvest", primary: "Domination" },
  { name: "Hail of Blades", primary: "Domination" },
  { name: "Summon Aery", primary: "Sorcery" },
  { name: "Arcane Comet", primary: "Sorcery" },
  { name: "Phase Rush", primary: "Sorcery" },
  { name: "Grasp of the Undying", primary: "Resolve" },
  { name: "Aftershock", primary: "Resolve" },
  { name: "Guardian", primary: "Resolve" },
  { name: "First Strike", primary: "Inspiration" }
];

const SUMMONER_SPELLS = [
  ["SummonerFlash", "SummonerDot"], // Flash + Ignite
  ["SummonerFlash", "SummonerTeleport"], // Flash + TP
  ["SummonerFlash", "SummonerHeal"], // Flash + Heal
  ["SummonerFlash", "SummonerBarrier"], // Flash + Barrier
  ["SummonerFlash", "SummonerBoost"], // Flash + Cleanse
  ["SummonerFlash", "SummonerExhaust"], // Flash + Exhaust
  ["SummonerFlash", "SummonerSmite"] // Flash + Smite
];

const TIERS = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];
const RANKS = ["IV", "III", "II", "I"];

// Função hash simples e determinística para gerar sementes baseadas no nome
function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// ATENCAO: esta funcao gera dados 100% ficticios (elo, LP, winrate, campeoes) a partir de um hash
// do Riot ID. NUNCA chame isso a partir de uma rota que responde a uma busca real de jogador -
// use apenas em testes/storybook locais, nunca como fallback silencioso em producao.
export function generateMockPlayerData(name: string, tag: string, region: string): PlayerDashboardData {
  const cleanName = name.trim();
  const cleanTag = tag.trim().toUpperCase();
  const seedString = `${cleanName}#${cleanTag}-${region}`;
  const seed = getHash(seedString);

  // Perfil
  const level = 30 + (seed % 970);
  const profileIconId = 1 + (seed % 6000);
  
  // Elo
  const tierIndex = seed % TIERS.length;
  const tier = TIERS[tierIndex];
  const rank = tierIndex >= 7 ? "" : RANKS[seed % RANKS.length]; // Master+ não tem divisões (I, II, etc.)
  const lp = seed % 100;
  
  // Vitórias/Derrotas baseadas no elo
  const baseGames = 80 + (seed % 400);
  // Master+ tem taxas de vitória ligeiramente mais altas
  const winRateSeed = 47 + (seed % 12);
  const wins = Math.round((baseGames * winRateSeed) / 100);
  const losses = baseGames - wins;
  const winRate = Number(((wins / baseGames) * 100).toFixed(1));

  const profile: PlayerProfile = {
    name: cleanName,
    tag: cleanTag,
    region: region.toUpperCase(),
    level,
    profileIconId,
    tier,
    rank,
    leaguePoints: lp,
    wins,
    losses,
    winRate
  };

  // Campeões mais jogados (3 a 5 campeões baseados no seed)
  const numChamps = 3 + (seed % 3);
  const selectedChamps: typeof MOCK_CHAMPIONS = [];
  const tempChamps = [...MOCK_CHAMPIONS];
  
  for (let i = 0; i < numChamps; i++) {
    const idx = (seed + i * 29) % tempChamps.length;
    selectedChamps.push(tempChamps[idx]);
    tempChamps.splice(idx, 1);
  }

  // Estatísticas por Campeão
  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let totalWinRate = 0;

  const champions: ChampionStats[] = selectedChamps.map((champ, index) => {
    const champSeed = seed + index * 43;
    const games = Math.round((baseGames * (40 - index * 10)) / 100) + 1;
    const champWinRateSeed = 45 + (champSeed % 20);
    const champWins = Math.round((games * champWinRateSeed) / 100);
    const champLosses = games - champWins;
    const champWinRate = Number(((champWins / games) * 100).toFixed(1));

    // KDA
    const kills = Number((4 + (champSeed % 7) + (champSeed % 10) / 10).toFixed(1));
    const deaths = Number((3 + (champSeed % 6) + (champSeed % 8) / 10).toFixed(1));
    const assists = Number((5 + (champSeed % 9) + (champSeed % 10) / 10).toFixed(1));
    const kdaRatio = Number(((kills + assists) / Math.max(1, deaths)).toFixed(2)).toFixed(2);

    totalKills += kills * games;
    totalDeaths += deaths * games;
    totalAssists += assists * games;
    totalWinRate += champWinRate;

    return {
      championId: champ.id,
      championName: champ.name,
      games,
      wins: champWins,
      losses: champLosses,
      winRate: champWinRate,
      kills,
      deaths,
      assists,
      kdaRatio
    };
  }).sort((a, b) => b.games - a.games);

  // Estatísticas Gerais (médias ponderadas ou geradas)
  const avgKills = Number((totalKills / baseGames).toFixed(1));
  const avgDeaths = Number((totalDeaths / baseGames).toFixed(1));
  const avgAssists = Number((totalAssists / baseGames).toFixed(1));
  const avgKdaRatio = Number(((avgKills + avgAssists) / Math.max(1, avgDeaths)).toFixed(2)).toFixed(2);

  const kp = 40 + (seed % 28);
  const csMin = Number((5.5 + (seed % 4) + (seed % 10) / 10).toFixed(1));
  const goldMin = Math.round(320 + (seed % 130) + csMin * 10);
  const damageDealt = Math.round(15000 + (seed % 15000) + avgKills * 1200);
  const damageTaken = Math.round(12000 + (seed % 12000) + avgDeaths * 1500);
  const averageDuration = 1400 + (seed % 600); // ~23 a ~33 minutos
  const wardsPlaced = Math.round(6 + (seed % 18));
  const wardsDestroyed = Math.round(2 + (seed % 10));

  const stats: PlayerStats = {
    kda: {
      kills: avgKills,
      deaths: avgDeaths,
      assists: avgAssists,
      ratio: avgKdaRatio
    },
    kp,
    csMin,
    goldMin,
    damageDealt,
    damageTaken,
    averageDuration,
    wardsPlaced,
    wardsDestroyed
  };

  // Histórico de Partidas (últimas 10 partidas baseadas no seed)
  const history: MatchHistoryItem[] = Array.from({ length: 10 }).map((_, index) => {
    const matchSeed = seed + index * 97;
    const matchId = `${region.toUpperCase()}_${4500000000 + (matchSeed % 50000000)}`;
    const win = (matchSeed % 100) < winRate; // Segue a taxa de vitória do invocador
    
    // Escolhe um campeão dos mais jogados, ou ocasionalmente um aleatório
    const usePlayedChamp = (matchSeed % 10) < 8;
    const champ = usePlayedChamp 
      ? selectedChamps[matchSeed % selectedChamps.length] 
      : MOCK_CHAMPIONS[matchSeed % MOCK_CHAMPIONS.length];

    // Stats da partida individual
    const kills = win ? (3 + (matchSeed % 10)) : (0 + (matchSeed % 6));
    const deaths = win ? (1 + (matchSeed % 5)) : (3 + (matchSeed % 9));
    const assists = 2 + (matchSeed % 12);
    const duration = 1200 + (matchSeed % 800); // 20 a 33 min

    // Lane preferencial por classe de campeão
    let lane: MatchHistoryItem["lane"] = "MID";
    if (champ.tag === "Marksman") lane = "ADC";
    else if (champ.tag === "Support") lane = "SUPPORT";
    else if (champ.tag === "Tank") lane = (matchSeed % 2 === 0) ? "TOP" : "SUPPORT";
    else if (champ.tag === "Fighter") lane = (matchSeed % 2 === 0) ? "TOP" : "JUNGLE";
    else if (champ.tag === "Assassin") lane = (matchSeed % 2 === 0) ? "MID" : "JUNGLE";

    // Itens reais da categoria
    const itemsPool = MOCK_ITEMS_BY_ROLE[champ.tag] || MOCK_ITEMS_BY_ROLE.Fighter;
    const items = [];
    const itemIdxs = [0, 1, 2, 3, 4, 5];
    const shuffIdxs = itemIdxs.sort(() => 0.5 - (matchSeed % 10) / 10);
    
    for (let i = 0; i < 6; i++) {
      const idx = shuffIdxs[i] % itemsPool.length;
      items.push(itemsPool[idx]);
    }
    
    const trinket = lane === "SUPPORT" ? "3364" : "3340"; // Oracle Alteration ou Stealth Ward

    // Spells
    const spellIdx = (matchSeed % SUMMONER_SPELLS.length);
    let spells = SUMMONER_SPELLS[spellIdx];
    if (lane === "JUNGLE") {
      spells = ["SummonerFlash", "SummonerSmite"];
    }

    // Runes
    const runeIdx = matchSeed % RUNES_KEYSTONES.length;
    const rune = RUNES_KEYSTONES[runeIdx];

    // Timestamp espaçado (ex: de 2 a 36 horas atrás)
    const timeOffset = (index + 1) * (2 * 60 * 60 * 1000 + (matchSeed % (24 * 60 * 60 * 1000)));
    const timestamp = Date.now() - timeOffset;

    return {
      matchId,
      championId: champ.id,
      championName: champ.name,
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
        keystone: rune.name,
        primaryStyle: rune.primary
      },
      timestamp
    };
  });

  return {
    profile,
    stats,
    champions,
    history
  };
}

// Cache simples em memória para consultas da Riot API (válido por 5 minutos)
const cache = new Map<string, { data: PlayerDashboardData; expires: number }>();

export function getCachedPlayerData(name: string, tag: string, region: string): PlayerDashboardData | null {
  const key = `${name.trim().toLowerCase()}#${tag.trim().toLowerCase()}-${region.toLowerCase()}`;
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  return null;
}

export function setCachedPlayerData(name: string, tag: string, region: string, data: PlayerDashboardData) {
  const key = `${name.trim().toLowerCase()}#${tag.trim().toLowerCase()}-${region.toLowerCase()}`;
  cache.set(key, {
    data,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutos de cache
  });
}

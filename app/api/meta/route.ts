import { NextRequest, NextResponse } from "next/server";
import { fetchChampionList } from "@/lib/ddragon";
import { getChampionProfile, type PrimaryLane } from "@/lib/championProfiles";
import { META_LANES, type MetaChampionRow, type MetaPayload, tierOfScore } from "@/lib/meta";
import { PATCH } from "@/lib/utils";

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
  ru: { platform: "ru", regional: "europe" },
};

const QUEUE = "RANKED_SOLO_5x5";
const MATCH_QUEUE_ID = 420;
const CACHE_TTL = 30 * 60 * 1000;
const cache = new Map<string, { expires: number; payload: MetaPayload }>();

type LeagueEntry = {
  summonerId?: string;
  puuid?: string;
  leaguePoints?: number;
  wins?: number;
  losses?: number;
};

type MatchParticipant = {
  championId: number;
  win: boolean;
  teamPosition?: string;
  individualPosition?: string;
};

type MatchDto = {
  metadata?: { matchId: string };
  info?: {
    queueId: number;
    participants: MatchParticipant[];
  };
};

function laneFromPosition(position?: string): PrimaryLane | null {
  if (position === "TOP") return "Top";
  if (position === "JUNGLE") return "Jungle";
  if (position === "MIDDLE") return "Mid";
  if (position === "BOTTOM") return "ADC";
  if (position === "UTILITY") return "Support";
  return null;
}

async function riotFetch<T>(url: string, apiKey: string): Promise<T> {
  const response = await fetch(url, {
    headers: { "X-Riot-Token": apiKey },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Riot API ${response.status} em ${url}`);
  }

  return response.json() as Promise<T>;
}

async function resolvePuuid(entry: LeagueEntry, platform: string, apiKey: string) {
  if (entry.puuid) return entry.puuid;
  if (!entry.summonerId) return null;

  const summoner = await riotFetch<{ puuid?: string }>(
    `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/${entry.summonerId}`,
    apiKey,
  );

  return summoner.puuid ?? null;
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "RIOT_API_KEY nao configurada. Configure a variavel na Vercel para ativar meta por amostra real.",
        code: "riot_api_not_configured",
      },
      { status: 501 },
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const region = (searchParams.get("region") || "br").toLowerCase();
    const config = REGION_MAPPING[region];

    if (!config) {
      return NextResponse.json({ error: "Regiao nao suportada." }, { status: 400 });
    }

    const cacheKey = `${region}-${QUEUE}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return NextResponse.json(cached.payload);
    }

    const playersLimit = Math.min(Number(searchParams.get("players") || 6), 12);
    const matchesPerPlayer = Math.min(Number(searchParams.get("matches") || 2), 4);
    const maxMatches = Math.min(Number(searchParams.get("maxMatches") || 10), 24);

    const [{ data: champions }, league] = await Promise.all([
      fetchChampionList(),
      riotFetch<{ entries: LeagueEntry[] }>(
        `https://${config.platform}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/${QUEUE}`,
        apiKey,
      ),
    ]);

    const championByKey = new Map(Object.values(champions).map((champion) => [Number(champion.key), champion]));
    const entries = [...(league.entries || [])]
      .sort((a, b) => (b.leaguePoints || 0) - (a.leaguePoints || 0))
      .slice(0, playersLimit);

    const puuids = (
      await Promise.all(entries.map((entry) => resolvePuuid(entry, config.platform, apiKey).catch(() => null)))
    ).filter(Boolean) as string[];

    const matchIdGroups = await Promise.all(
      puuids.map((puuid) =>
        riotFetch<string[]>(
          `https://${config.regional}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${matchesPerPlayer}&queue=${MATCH_QUEUE_ID}`,
          apiKey,
        ).catch(() => []),
      ),
    );

    const matchIds = Array.from(new Set(matchIdGroups.flat())).slice(0, maxMatches);
    const matches = (
      await Promise.all(
        matchIds.map((matchId) =>
          riotFetch<MatchDto>(`https://${config.regional}.api.riotgames.com/lol/match/v5/matches/${matchId}`, apiKey).catch(() => null),
        ),
      )
    ).filter(Boolean) as MatchDto[];

    const stats = new Map<string, { id: string; lane: PrimaryLane; games: number; wins: number }>();

    for (const match of matches) {
      if (!match.info || match.info.queueId !== MATCH_QUEUE_ID) continue;

      for (const participant of match.info.participants) {
        const lane = laneFromPosition(participant.teamPosition || participant.individualPosition);
        const champion = championByKey.get(participant.championId);
        if (!lane || !champion) continue;

        const key = `${champion.id}-${lane}`;
        const current = stats.get(key) ?? { id: champion.id, lane, games: 0, wins: 0 };
        current.games += 1;
        if (participant.win) current.wins += 1;
        stats.set(key, current);
      }
    }

    const laneTotals = new Map<PrimaryLane, number>();
    for (const value of Array.from(stats.values())) {
      laneTotals.set(value.lane, (laneTotals.get(value.lane) || 0) + value.games);
    }

    const rowsByLane = META_LANES.map((lane) => {
      const rows = Array.from(stats.values())
        .filter((entry) => entry.lane === lane.id)
        .map((entry) => {
          const champion = Object.values(champions).find((candidate) => candidate.id === entry.id);
          if (!champion) return null;

          const profile = getChampionProfile(champion.id, champion.tags);
          const winRate = Number(((entry.wins / entry.games) * 100).toFixed(1));
          const laneTotal = laneTotals.get(entry.lane) || entry.games;
          const pickRate = Number(((entry.games / laneTotal) * 100).toFixed(1));
          const score = winRate + Math.min(pickRate, 20) * 0.35 + Math.min(entry.games, 12) * 0.3;

          return {
            id: champion.id,
            name: champion.name,
            lane: entry.lane,
            archetype: profile.archetype,
            tier: tierOfScore(score),
            winRate,
            pickRate,
            banRate: 0,
            games: entry.games,
            wins: entry.wins,
          } satisfies MetaChampionRow;
        })
        .filter(Boolean)
        .sort((a, b) => {
          if (b!.games !== a!.games) return b!.games - a!.games;
          return b!.winRate - a!.winRate;
        })
        .slice(0, 8) as MetaChampionRow[];

      return { ...lane, rows };
    });

    const payload: MetaPayload = {
      source: "riot",
      region,
      patch: PATCH,
      updatedAt: new Date().toISOString(),
      sampleSize: matches.length,
      rowsByLane,
    };

    cache.set(cacheKey, { expires: Date.now() + CACHE_TTL, payload });
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Erro na meta Riot:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro desconhecido ao montar meta real.",
        code: "riot_meta_failed",
      },
      { status: 500 },
    );
  }
}

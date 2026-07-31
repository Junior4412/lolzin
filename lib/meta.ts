import { getChampionProfile, type ChampionArchetype, type PrimaryLane } from "@/lib/championProfiles";
import type { ChampionTier } from "@/types";

export type MetaSource = "estimated" | "riot";

export type MetaChampionRow = {
  id: string;
  name: string;
  lane: PrimaryLane;
  archetype: ChampionArchetype;
  tier: ChampionTier;
  winRate: number;
  pickRate: number;
  banRate: number;
  games: number;
  wins: number;
};

export type MetaLaneGroup = {
  id: PrimaryLane;
  label: string;
  description: string;
  rows: MetaChampionRow[];
};

export type MetaPayload = {
  source: MetaSource;
  region: string;
  patch: string;
  updatedAt: string;
  sampleSize: number;
  rowsByLane: MetaLaneGroup[];
};

export const META_LANES: Array<Omit<MetaLaneGroup, "rows">> = [
  { id: "Top", label: "Top", description: "Frontline, duelistas e campeoes de side lane." },
  { id: "Jungle", label: "Jungle", description: "Pressao de mapa, objetivos e ganks de alto impacto." },
  { id: "Mid", label: "Mid", description: "Magos, assassinos e campeoes de controle central." },
  { id: "ADC", label: "ADC", description: "Atiradores e carries de DPS para lutas longas." },
  { id: "Support", label: "Suporte", description: "Engage, peel, poke e protecao para o mapa inferior." },
];

export function scoreOf(id: string) {
  return id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function tierOfScore(score: number): ChampionTier {
  if (score >= 58) return "S+";
  if (score >= 54) return "S";
  if (score >= 50) return "A";
  if (score >= 46) return "B";
  if (score >= 42) return "C";
  return "D";
}

function laneBoost(lane: PrimaryLane) {
  const boosts: Record<PrimaryLane, number> = {
    Top: 0.1,
    Jungle: 0.35,
    Mid: 0.2,
    ADC: 0.3,
    Support: 0.45,
  };
  return boosts[lane];
}

export function createEstimatedMetaPayload(
  champions: Array<{ id: string; name: string; tags: string[] }>,
  patch: string,
  region = "br",
): MetaPayload {
  const rowsByLane = META_LANES.map((lane) => {
    const rows = champions
      .map((champion) => {
        const profile = getChampionProfile(champion.id, champion.tags);
        const seed = scoreOf(`${champion.id}-${profile.lane}`);
        const winRate = 48.1 + ((seed % 57) / 10) + laneBoost(profile.lane);
        const pickRate = 1.2 + ((seed % 130) / 10);
        const banRate = Math.min(38, pickRate * (0.55 + (seed % 8) / 10));
        const score = winRate + pickRate * 0.16 + banRate * 0.05;

        return {
          id: champion.id,
          name: champion.name,
          lane: profile.lane,
          archetype: profile.archetype,
          tier: tierOfScore(score),
          winRate,
          pickRate,
          banRate,
          games: 0,
          wins: 0,
        } satisfies MetaChampionRow;
      })
      .filter((champion) => champion.lane === lane.id)
      .sort((a, b) => {
        const tierRank: Record<ChampionTier, number> = { "S+": 5, S: 4, A: 3, B: 2, C: 1, D: 0 };
        const tierDiff = tierRank[b.tier] - tierRank[a.tier];
        if (tierDiff !== 0) return tierDiff;
        return b.winRate - a.winRate;
      })
      .slice(0, 8);

    return { ...lane, rows };
  });

  return {
    source: "estimated",
    region,
    patch,
    updatedAt: new Date().toISOString(),
    sampleSize: 0,
    rowsByLane,
  };
}

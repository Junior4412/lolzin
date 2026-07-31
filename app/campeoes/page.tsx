import { fetchChampionList } from "@/lib/ddragon";
import { ChampionGrid } from "@/components/champion/ChampionGrid";
import { getChampionProfile } from "@/lib/championProfiles";
import type { ChampionMeta, ChampionRole, ChampionTier } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campeões",
  description: "Descubra as melhores builds, runas e estatísticas para todos os campeões do League of Legends.",
};

// Revalidate cache every hour (ISR)
export const revalidate = 3600;

export default async function ChampionsPage() {
  const { data } = await fetchChampionList();

  // In a real scenario, this would come from our backend DB with actual win rates.
  // For V2 MVP without Riot API key, we simulate the meta data based on tags and random seeds for demonstration,
  // just to show the UI working flawlessly.
  
  const champions: ChampionMeta[] = Object.values(data).map(c => {
    // Deterministic random-like values based on champion ID length/char codes
    const seed = c.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    // Tier assignment
    let tier: ChampionTier = "C";
    if (seed % 10 === 0) tier = "S+";
    else if (seed % 7 === 0) tier = "S";
    else if (seed % 3 === 0) tier = "A";
    else if (seed % 2 === 0) tier = "B";
    else if (seed % 13 === 0) tier = "D";

    // Win Rate (45% to 54%)
    const winRate = 0.45 + ((seed % 100) / 100) * 0.09;
    
    // Pick Rate (0.1% to 20%)
    const pickRate = 0.001 + ((seed % 200) / 200) * 0.2;

    const profile = getChampionProfile(c.id, c.tags);

    return {
      id: c.id,
      name: c.name,
      tier,
      winRate,
      pickRate,
      banRate: pickRate * 0.8,
      trend: seed % 2 === 0 ? "up" : "down",
      roles: [profile.lane] as ChampionRole[],
      tags: c.tags,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-text-primary mb-2">
          Campeões
        </h1>
        <p className="text-text-secondary">
          Explore builds, runas, matchups e estatísticas para todos os {champions.length} campeões.
        </p>
      </div>

      <ChampionGrid champions={champions} />
    </div>
  );
}

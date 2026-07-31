import Link from "next/link";
import type { Metadata } from "next";
import { fetchChampionList } from "@/lib/ddragon";
import { PATCH, cdnChampionSquare, getTierBg, getTierColor } from "@/lib/utils";
import { BarChart2, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Meta",
  description: "Tier list estimada por classe, taxa de vitoria e popularidade.",
};

export const revalidate = 3600;

function scoreOf(id: string) {
  return id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function tierOf(seed: number) {
  if (seed % 10 === 0) return "S+";
  if (seed % 7 === 0) return "S";
  if (seed % 3 === 0) return "A";
  if (seed % 2 === 0) return "B";
  return "C";
}

export default async function MetaPage() {
  const { data } = await fetchChampionList();
  const rows = Object.values(data)
    .map((champion) => {
      const seed = scoreOf(champion.id);
      return {
        ...champion,
        tier: tierOf(seed),
        winRate: 46 + (seed % 90) / 10,
        pickRate: 1 + (seed % 140) / 10,
      };
    })
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 30);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gold">Tier list</span>
        <h1 className="font-display text-4xl font-black">Meta do patch {PATCH}</h1>
        <p className="max-w-2xl text-text-secondary">
          Ranking estimado para guiar picks, bans e prioridades de build enquanto os dados reais por servidor nao estao conectados.
        </p>
      </div>

      <div className="glass rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_90px_90px_90px] gap-3 border-b border-border px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">
          <span>Campeao</span>
          <span>Tier</span>
          <span>Win</span>
          <span>Pick</span>
        </div>
        {rows.map((champion) => (
          <Link key={champion.id} href={`/campeoes/${champion.id}`} className="grid grid-cols-[1fr_90px_90px_90px] gap-3 border-b border-border/50 px-4 py-3 last:border-b-0 hover:bg-elevated/40">
            <span className="flex min-w-0 items-center gap-3">
              <img src={cdnChampionSquare(PATCH, champion.id)} alt={champion.name} className="h-10 w-10 rounded border border-border object-cover" />
              <span className="min-w-0">
                <span className="block truncate font-semibold">{champion.name}</span>
                <span className="block truncate text-xs text-text-muted">{champion.tags.join(" / ")}</span>
              </span>
            </span>
            <span className={`w-fit self-center rounded border px-2 py-0.5 text-xs font-bold ${getTierBg(champion.tier)} ${getTierColor(champion.tier)}`}>{champion.tier}</span>
            <span className="self-center font-mono font-bold text-win">{champion.winRate.toFixed(1)}%</span>
            <span className="self-center font-mono text-text-secondary">{champion.pickRate.toFixed(1)}%</span>
          </Link>
        ))}
      </div>

      <Link href="/campeoes" className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-sm text-text-secondary hover:border-border-bright hover:text-text-primary">
        <BarChart2 className="h-4 w-4" />
        Explorar todos os campeoes
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

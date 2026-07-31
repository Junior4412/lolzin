import Link from "next/link";
import type { Metadata } from "next";
import { fetchChampionList } from "@/lib/ddragon";
import { getChampionProfile, type PrimaryLane } from "@/lib/championProfiles";
import { PATCH, cdnChampionSquare, getTierBg, getTierColor } from "@/lib/utils";
import { BarChart2, ChevronRight, Shield, Skull, Sparkles, Swords, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Meta",
  description: "Tier list estimada por classe, taxa de vitoria e popularidade.",
};

export const revalidate = 3600;

function scoreOf(id: string) {
  return id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function tierOf(seed: number) {
  if (seed % 17 === 0) return "S+";
  if (seed % 7 === 0) return "S";
  if (seed % 5 === 0) return "A";
  if (seed % 2 === 0) return "B";
  return "C";
}

const lanes: Array<{ id: PrimaryLane; label: string; icon: typeof Swords; description: string }> = [
  { id: "Top", label: "Top", icon: Shield, description: "Frontline, duelistas e campeoes de side lane." },
  { id: "Jungle", label: "Jungle", icon: Swords, description: "Pressao de mapa, objetivos e ganks de alto impacto." },
  { id: "Mid", label: "Mid", icon: Sparkles, description: "Magos, assassinos e campeoes de controle central." },
  { id: "ADC", label: "ADC", icon: Target, description: "Atiradores e carries de DPS para lutas longas." },
  { id: "Support", label: "Suporte", icon: Skull, description: "Engage, peel, poke e protecao para o mapa inferior." },
];

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

export default async function MetaPage() {
  const { data } = await fetchChampionList();
  const rowsByLane = lanes.map((lane) => {
    const rows = Object.values(data)
      .map((champion) => {
        const profile = getChampionProfile(champion.id, champion.tags);
        const seed = scoreOf(`${champion.id}-${profile.lane}`);
        const winRate = 48.1 + ((seed % 57) / 10) + laneBoost(profile.lane);
        const pickRate = 1.2 + ((seed % 130) / 10);
        const banRate = Math.min(38, pickRate * (0.55 + (seed % 8) / 10));

        return {
          ...champion,
          profile,
          tier: tierOf(seed),
          winRate,
          pickRate,
          banRate,
        };
      })
      .filter((champion) => champion.profile.lane === lane.id)
      .sort((a, b) => {
        const tierScore = { "S+": 5, S: 4, A: 3, B: 2, C: 1, D: 0 };
        const tierDiff = tierScore[b.tier as keyof typeof tierScore] - tierScore[a.tier as keyof typeof tierScore];
        if (tierDiff !== 0) return tierDiff;
        return b.winRate - a.winRate;
      })
      .slice(0, 8);

    return { ...lane, rows };
  });

  const featured = rowsByLane.flatMap((lane) => lane.rows.slice(0, 2)).sort((a, b) => b.winRate - a.winRate).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="relative overflow-hidden rounded-lg border border-border bg-deep px-5 py-10 md:px-8">
        <div className="absolute inset-0 bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Senna_0.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep via-deep/95 to-deep/70" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gold">Tier list por rota</span>
            <h1 className="font-display text-4xl font-black md:text-5xl">Meta do patch {PATCH}</h1>
            <p className="text-text-secondary md:text-lg">
              Ranking separado por Top, Jungle, Mid, ADC e Suporte para guiar picks, bans e builds com leitura inspirada em OP.GG e Blitz.
            </p>
          </div>
          <Link href="/campeoes" className="inline-flex w-fit items-center gap-2 rounded border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/15">
            Explorar campeoes
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-5">
        {featured.map((champion, index) => (
          <Link key={`${champion.id}-${champion.profile.lane}`} href={`/campeoes/${champion.id}`} className="group overflow-hidden rounded-lg border border-border bg-surface transition hover:border-gold/50">
            <div className="relative h-28 overflow-hidden">
              <img src={cdnChampionSquare(PATCH, champion.id)} alt={champion.name} className="h-full w-full scale-110 object-cover opacity-80 transition group-hover:scale-125" />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
              <span className="absolute left-3 top-3 rounded border border-gold/30 bg-void/70 px-2 py-0.5 text-xs font-black text-gold">#{index + 1}</span>
            </div>
            <div className="p-3">
              <p className="truncate font-display text-lg font-bold">{champion.name}</p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-text-secondary">{champion.profile.lane}</span>
                <span className="font-mono font-bold text-win">{champion.winRate.toFixed(1)}%</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {rowsByLane.map(({ id, label, icon: Icon, description, rows }) => (
          <section key={id} className="overflow-hidden rounded-lg border border-border bg-surface/80 shadow-card">
            <div className="flex items-center justify-between border-b border-border bg-elevated/40 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded border border-gold/30 bg-gold/10">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">{label}</h2>
                  <p className="text-xs text-text-muted">{description}</p>
                </div>
              </div>
              <span className="rounded border border-border bg-deep px-2 py-1 text-xs font-mono text-text-secondary">{rows.length} picks</span>
            </div>

            <div className="grid grid-cols-[42px_1fr_62px_68px_68px] gap-3 border-b border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-muted">
              <span>#</span>
              <span>Campeao</span>
              <span>Tier</span>
              <span>Win</span>
              <span>Pick</span>
            </div>

            {rows.map((champion, index) => (
              <Link key={champion.id} href={`/campeoes/${champion.id}`} className="grid grid-cols-[42px_1fr_62px_68px_68px] gap-3 border-b border-border/50 px-4 py-3 last:border-b-0 hover:bg-elevated/40">
                <span className="self-center font-mono text-sm font-bold text-text-muted">{index + 1}</span>
                <span className="flex min-w-0 items-center gap-3">
                  <img src={cdnChampionSquare(PATCH, champion.id)} alt={champion.name} className="h-10 w-10 rounded border border-border object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{champion.name}</span>
                    <span className="block truncate text-xs text-text-muted">{champion.profile.archetype}</span>
                  </span>
                </span>
                <span className={`w-fit self-center rounded border px-2 py-0.5 text-xs font-bold ${getTierBg(champion.tier)} ${getTierColor(champion.tier)}`}>{champion.tier}</span>
                <span className="self-center font-mono font-bold text-win">{champion.winRate.toFixed(1)}%</span>
                <span className="self-center font-mono text-text-secondary">{champion.pickRate.toFixed(1)}%</span>
              </Link>
            ))}
          </section>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-deep p-4 text-sm text-text-secondary">
        <BarChart2 className="mr-2 inline h-4 w-4 text-gold" />
        Dados exibidos como ranking estimado local. A estrutura esta pronta para substituir por amostras reais por servidor quando a integracao de estatisticas for conectada.
      </div>
    </div>
  );
}

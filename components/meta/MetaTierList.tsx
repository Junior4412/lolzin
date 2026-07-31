"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart2, ChevronRight, RefreshCcw, Shield, Skull, Sparkles, Swords, Target } from "lucide-react";
import type { MetaPayload } from "@/lib/meta";
import type { PrimaryLane } from "@/lib/championProfiles";
import { cdnChampionSquare, getTierBg, getTierColor } from "@/lib/utils";

const laneIcons: Record<PrimaryLane, typeof Swords> = {
  Top: Shield,
  Jungle: Swords,
  Mid: Sparkles,
  ADC: Target,
  Support: Skull,
};

const regions = [
  { id: "br", label: "BR" },
  { id: "na", label: "NA" },
  { id: "euw", label: "EUW" },
  { id: "kr", label: "KR" },
  { id: "jp", label: "JP" },
  { id: "las", label: "LAS" },
  { id: "lan", label: "LAN" },
];

export function MetaTierList({ initialMeta }: { initialMeta: MetaPayload }) {
  const [meta, setMeta] = useState(initialMeta);
  const [region, setRegion] = useState(initialMeta.region);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadRiotMeta(selectedRegion = region) {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/meta?region=${selectedRegion}`);
      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.error || "Nao foi possivel carregar a meta real agora.");
        return;
      }

      setMeta(payload);
    } catch {
      setMessage("Falha de conexao ao buscar a amostra real da Riot.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRiotMeta(region);
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featured = useMemo(
    () => meta.rowsByLane.flatMap((lane) => lane.rows.slice(0, 2)).sort((a, b) => b.winRate - a.winRate).slice(0, 5),
    [meta],
  );

  const sourceLabel =
    meta.source === "riot"
      ? `Amostra Riot ${meta.region.toUpperCase()} - ${meta.sampleSize} partidas`
      : "Estimativa local ate conectar RIOT_API_KEY";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface/80 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-text-primary">{sourceLabel}</p>
          <p className="mt-1 text-xs text-text-muted">
            Atualizado em {new Date(meta.updatedAt).toLocaleString("pt-BR")} - Pick rate por lane, win rate por partidas ranqueadas.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={region}
            onChange={(event) => {
              const nextRegion = event.target.value;
              setRegion(nextRegion);
              loadRiotMeta(nextRegion);
            }}
            className="h-10 rounded border border-border bg-deep px-3 text-sm font-semibold text-text-primary outline-none focus:border-gold/60"
          >
            {regions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => loadRiotMeta(region)}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded border border-gold/30 bg-gold/10 px-3 text-sm font-semibold text-gold transition hover:bg-gold/15 disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-warn/30 bg-warn/10 p-4 text-sm leading-relaxed text-text-secondary">
          {message}
        </div>
      )}

      <section className="grid grid-cols-1 gap-3 md:grid-cols-5">
        {featured.map((champion, index) => (
          <Link key={`${champion.id}-${champion.lane}`} href={`/campeoes/${champion.id}`} className="group overflow-hidden rounded-lg border border-border bg-surface transition hover:border-gold/50">
            <div className="relative h-28 overflow-hidden">
              <img src={cdnChampionSquare(meta.patch, champion.id)} alt={champion.name} className="h-full w-full scale-110 object-cover opacity-80 transition group-hover:scale-125" />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
              <span className="absolute left-3 top-3 rounded border border-gold/30 bg-void/70 px-2 py-0.5 text-xs font-black text-gold">#{index + 1}</span>
            </div>
            <div className="p-3">
              <p className="truncate font-display text-lg font-bold">{champion.name}</p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-text-secondary">{champion.lane}</span>
                <span className="font-mono font-bold text-win">{champion.winRate.toFixed(1)}%</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {meta.rowsByLane.map(({ id, label, description, rows }) => {
          const Icon = laneIcons[id];
          return (
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

              <div className="grid grid-cols-[36px_1fr_58px_64px_64px] gap-2 border-b border-border px-3 py-2 text-xs font-bold uppercase tracking-wider text-text-muted sm:grid-cols-[42px_1fr_62px_68px_68px] sm:gap-3 sm:px-4">
                <span>#</span>
                <span>Campeao</span>
                <span>Tier</span>
                <span>Win</span>
                <span>Pick</span>
              </div>

              {rows.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-text-secondary">
                  Sem amostra suficiente nessa lane para a regiao selecionada.
                </div>
              )}

              {rows.map((champion, index) => (
                <Link key={`${champion.id}-${champion.lane}`} href={`/campeoes/${champion.id}`} className="grid grid-cols-[36px_1fr_58px_64px_64px] gap-2 border-b border-border/50 px-3 py-3 last:border-b-0 hover:bg-elevated/40 sm:grid-cols-[42px_1fr_62px_68px_68px] sm:gap-3 sm:px-4">
                  <span className="self-center font-mono text-sm font-bold text-text-muted">{index + 1}</span>
                  <span className="flex min-w-0 items-center gap-3">
                    <img src={cdnChampionSquare(meta.patch, champion.id)} alt={champion.name} className="h-10 w-10 rounded border border-border object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{champion.name}</span>
                      <span className="block truncate text-xs text-text-muted">
                        {champion.games > 0 ? `${champion.games} jogos - ${champion.wins}V` : champion.archetype}
                      </span>
                    </span>
                  </span>
                  <span className={`w-fit self-center rounded border px-2 py-0.5 text-xs font-bold ${getTierBg(champion.tier)} ${getTierColor(champion.tier)}`}>{champion.tier}</span>
                  <span className="self-center font-mono font-bold text-win">{champion.winRate.toFixed(1)}%</span>
                  <span className="self-center font-mono text-text-secondary">{champion.pickRate.toFixed(1)}%</span>
                </Link>
              ))}
            </section>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-deep p-4 text-sm text-text-secondary">
        <BarChart2 className="mr-2 inline h-4 w-4 text-gold" />
        {meta.source === "riot"
          ? "Conectado na Riot API: dados calculados a partir de partidas ranqueadas recentes da fila Solo/Duo high elo."
          : "Para ativar dados reais, configure RIOT_API_KEY na Vercel. Enquanto isso, exibimos a estimativa local como fallback."}
        <Link href="/campeoes" className="ml-2 inline-flex items-center gap-1 text-gold hover:underline">
          Ver campeoes
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

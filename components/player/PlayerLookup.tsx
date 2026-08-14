"use client";

import { FormEvent, useMemo, useState } from "react";
import { AlertCircle, ArrowUpRight, BarChart3, Clock3, Crown, Search, Sparkles, Swords, Trophy } from "lucide-react";
import type { PlayerDashboardData } from "@/lib/riot";
import { PATCH, cdnChampionSquare, cdnItemImage, cdnProfileIcon, cdnSpellImage, formatDuration, formatRelativeTime } from "@/lib/utils";

const REGIONS = [
  { id: "br", label: "BR" },
  { id: "na", label: "NA" },
  { id: "euw", label: "EUW" },
  { id: "eune", label: "EUNE" },
  { id: "kr", label: "KR" },
  { id: "jp", label: "JP" },
  { id: "las", label: "LAS" },
  { id: "lan", label: "LAN" },
  { id: "oce", label: "OCE" },
  { id: "tr", label: "TR" },
  { id: "ru", label: "RU" },
];

const emptyStateCards = [
  { icon: Trophy, title: "Resumo competitivo", text: "Elo, LP, vitorias, derrotas e win rate do jogador." },
  { icon: Sparkles, title: "Campeoes assinatura", text: "Principais picks recentes, KDA medio e taxa de vitoria." },
  { icon: Swords, title: "Historico de partidas", text: "Campeao, rota, itens, runas e placar das ultimas partidas." },
];

function spellFile(spell: string) {
  return spell.endsWith(".png") ? spell : `${spell}.png`;
}

function tierLabel(tier: string, rank: string) {
  if (tier === "UNRANKED") return "Sem ranqueada";
  return `${tier}${rank ? ` ${rank}` : ""}`;
}

export function PlayerLookup() {
  const [riotId, setRiotId] = useState("");
  const [region, setRegion] = useState("br");
  const [data, setData] = useState<PlayerDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSearch = useMemo(() => riotId.trim().includes("#") && riotId.trim().length >= 4, [riotId]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSearch || loading) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/player?riotId=${encodeURIComponent(riotId.trim())}&region=${region}`);
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || "Nao foi possivel buscar esse jogador agora.");
        return;
      }

      setData(payload);
    } catch {
      setError("Falha de conexao ao consultar a API. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="relative overflow-hidden rounded-lg border border-gold/20 bg-surface/80 p-4 shadow-card md:p-5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
        <div className="grid gap-3 md:grid-cols-[1fr_150px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              value={riotId}
              onChange={(event) => setRiotId(event.target.value)}
              className="h-12 w-full rounded border border-border bg-deep pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-text-muted focus:border-gold/60"
              placeholder="Riot ID: Nome#TAG"
              aria-label="Riot ID"
            />
          </div>

          <select
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="h-12 rounded border border-border bg-deep px-3 text-sm font-semibold text-text-primary outline-none focus:border-gold/60"
            aria-label="Regiao"
          >
            {REGIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!canSearch || loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded border border-gold/40 bg-gold px-5 text-sm font-black uppercase tracking-wide text-void transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Buscando" : "Buscar"}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-text-muted">
          <span className="rounded border border-border bg-deep px-2 py-1">Formato: jrz#junin</span>
          <span className="rounded border border-border bg-deep px-2 py-1">Todas as regioes principais</span>
          <span className="rounded border border-border bg-deep px-2 py-1">Dados reais via Riot API</span>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-warn/30 bg-warn/10 p-4 text-sm text-text-secondary">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-warn" />
            <div>
              <p className="font-semibold text-text-primary">Busca indisponivel</p>
              <p className="mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!data && !error && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {emptyStateCards.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border border-border bg-surface/70 p-5">
              <Icon className="h-6 w-6 text-gold" />
              <h2 className="mt-4 font-display text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{text}</p>
            </div>
          ))}
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
            <div className="flex flex-col gap-5 border-b border-border bg-[linear-gradient(135deg,rgba(200,168,90,0.12),rgba(13,21,37,0.5))] p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <img src={cdnProfileIcon(PATCH, data.profile.profileIconId)} alt={data.profile.name} className="h-20 w-20 rounded-lg border border-gold/40 bg-deep object-cover" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-3xl font-black">{data.profile.name}</h2>
                    <span className="rounded border border-border bg-deep px-2 py-0.5 text-xs font-bold text-text-secondary">#{data.profile.tag}</span>
                    <span className="rounded border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs font-bold text-gold">{data.profile.region}</span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">Nivel {data.profile.level} - {tierLabel(data.profile.tier, data.profile.rank)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 md:min-w-[360px]">
                <Stat label="LP" value={data.profile.leaguePoints} />
                <Stat label="V/D" value={`${data.profile.wins}/${data.profile.losses}`} />
                <Stat label="Win" value={`${data.profile.winRate}%`} tone="win" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
              <StatBlock label="KDA medio" value={data.stats.kda.ratio} sub={`${data.stats.kda.kills}/${data.stats.kda.deaths}/${data.stats.kda.assists}`} />
              <StatBlock label="KP" value={`${data.stats.kp}%`} sub="participacao em abates" />
              <StatBlock label="CS/min" value={data.stats.csMin.toFixed(1)} sub={`${data.stats.goldMin} ouro/min`} />
              <StatBlock label="Duracao" value={formatDuration(data.stats.averageDuration)} sub="media recente" />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-surface/80 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-gold" />
                <h3 className="font-display text-xl font-bold">Campeoes assinatura</h3>
              </div>
              <div className="space-y-3">
                {data.champions.length === 0 && <p className="text-sm text-text-secondary">Nenhum campeao recente encontrado.</p>}
                {data.champions.map((champion) => (
                  <div key={champion.championId} className="flex items-center gap-3 rounded border border-border bg-deep p-3">
                    <img src={cdnChampionSquare(PATCH, champion.championId)} alt={champion.championName} className="h-11 w-11 rounded border border-border object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{champion.championName}</p>
                      <p className="text-xs text-text-muted">{champion.games} jogos - KDA {champion.kdaRatio}</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-win">{champion.winRate}%</span>
                  </div>
                ))}
              </div>
            </div>

              <div className="rounded-lg border border-border bg-surface/80 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-gold" />
                  <h3 className="font-display text-xl font-bold">Maestrias</h3>
                </div>
                <div className="space-y-3">
                  {(!data.mastery || data.mastery.length === 0) && <p className="text-sm text-text-secondary">Nenhuma maestria encontrada pela Riot API.</p>}
                  {(data.mastery || []).slice(0, 5).map((champion) => (
                    <div key={champion.championId} className="flex items-center gap-3 rounded border border-border bg-deep p-3">
                      <img src={cdnChampionSquare(PATCH, champion.championId)} alt={champion.championName} className="h-11 w-11 rounded border border-border object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{champion.championName}</p>
                        <p className="text-xs text-text-muted">
                          Nivel {champion.championLevel} - {champion.championPoints.toLocaleString("pt-BR")} pts
                        </p>
                      </div>
                      <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${champion.chestGranted ? "border-gold/30 bg-gold/10 text-gold" : "border-border text-text-muted"}`}>
                        {champion.chestGranted ? "Bau" : "Aberto"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface/80 p-5">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gold" />
                <h3 className="font-display text-xl font-bold">Historico recente</h3>
              </div>
              <div className="space-y-3">
                {data.history.length === 0 && <p className="text-sm text-text-secondary">Nenhuma partida recente encontrada para essa fila/regiao.</p>}
                {data.history.map((match) => (
                  <div key={match.matchId} className={`rounded border p-3 ${match.win ? "border-win/25 bg-win/5" : "border-loss/25 bg-loss/5"}`}>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <img src={cdnChampionSquare(PATCH, match.championId)} alt={match.championName} className="h-12 w-12 rounded border border-border object-cover" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{match.championName}</p>
                          <p className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                            <span>{match.lane}</span>
                            <span>{formatDuration(match.duration)}</span>
                            <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{formatRelativeTime(match.timestamp)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="font-mono text-sm font-bold">
                        <span className={match.win ? "text-win" : "text-loss"}>{match.win ? "Vitoria" : "Derrota"}</span>
                        <span className="ml-3 text-text-primary">{match.kills}/{match.deaths}/{match.assists}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {match.items.slice(0, 6).map((item, index) => (
                          <img key={`${match.matchId}-${item}-${index}`} src={cdnItemImage(PATCH, `${item}.png`)} alt="" className="h-7 w-7 rounded border border-border bg-deep object-cover" />
                        ))}
                        {match.spells.map((spell) => (
                          <img key={`${match.matchId}-${spell}`} src={cdnSpellImage(PATCH, spellFile(spell))} alt={spell} className="h-7 w-7 rounded border border-border bg-deep object-cover" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone?: "win" }) {
  return (
    <div className="rounded border border-border bg-deep p-3 text-center">
      <p className="text-xs uppercase tracking-wider text-text-muted">{label}</p>
      <p className={`mt-1 font-mono text-lg font-black ${tone === "win" ? "text-win" : "text-text-primary"}`}>{value}</p>
    </div>
  );
}

function StatBlock({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="bg-surface p-4">
      <p className="text-xs uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 font-mono text-2xl font-black text-text-primary">{value}</p>
      <p className="mt-1 text-xs text-text-secondary">{sub}</p>
    </div>
  );
}

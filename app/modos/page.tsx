import Link from "next/link";
import type { Metadata } from "next";
import { fetchGameModes } from "@/lib/gameModes";
import { PATCH } from "@/lib/utils";
import { ArrowRight, Gamepad2, Shield, Sparkles, Swords, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Modos",
  description: "Modos de jogo do League of Legends acompanhados direto da fonte oficial da Riot.",
};

export const revalidate = 86400;

function modeTone(mode: string) {
  if (mode.includes("ARAM")) return { icon: Sparkles, label: "Alternativo", className: "text-arcane-bright border-arcane-bright/30 bg-arcane-bright/10" };
  if (mode.includes("CLASSIC")) return { icon: Swords, label: "Summoner's Rift", className: "text-gold border-gold/30 bg-gold/10" };
  if (mode.includes("TUTORIAL")) return { icon: Shield, label: "Aprendizado", className: "text-win border-win/30 bg-win/10" };
  return { icon: Gamepad2, label: "Modo rotativo", className: "text-text-secondary border-border bg-surface" };
}

export default async function GameModesPage() {
  const modes = await fetchGameModes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <section className="relative overflow-hidden rounded-lg border border-border bg-deep px-5 py-10 md:px-8">
        <div className="absolute inset-0 bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ekko_0.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep via-deep/95 to-deep/70" />
        <div className="relative max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
            <Zap className="h-4 w-4" />
            Fonte Riot oficial
          </span>
          <h1 className="font-display text-4xl font-black md:text-5xl">Modos de jogo</h1>
          <p className="text-text-secondary md:text-lg">
            Esta aba acompanha o arquivo oficial de modos da Riot. Quando chegar modo novo ou rotativo, a atualizacao diaria do LOLZIN confere a fonte e esta pagina revalida automaticamente.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modes.map((mode) => {
          const tone = modeTone(mode.gameMode);
          const Icon = tone.icon;

          return (
            <article key={mode.gameMode} className="group relative overflow-hidden rounded-lg border border-border bg-surface p-5 shadow-card transition hover:border-gold/50">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded border ${tone.className}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`rounded border px-2 py-0.5 text-xs font-semibold ${tone.className}`}>{tone.label}</span>
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold">{mode.gameMode}</h2>
              <p className="mt-3 min-h-16 text-sm leading-relaxed text-text-secondary">{mode.description}</p>
            </article>
          );
        })}
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link href="/meta" className="group rounded-lg border border-border bg-deep p-5 transition hover:border-gold/50">
          <h2 className="font-display text-xl font-bold">Meta do patch {PATCH}</h2>
          <p className="mt-2 text-sm text-text-secondary">Veja a tier list por lane com amostra Riot quando a chave estiver configurada.</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
            Abrir meta
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
        <Link href="/campeoes" className="group rounded-lg border border-border bg-deep p-5 transition hover:border-gold/50">
          <h2 className="font-display text-xl font-bold">Todos os campeoes</h2>
          <p className="mt-2 text-sm text-text-secondary">Campeoes e itens usam Data Dragon, entao acompanham patch novo no job diario.</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
            Explorar campeoes
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </section>
    </div>
  );
}

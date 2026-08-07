import Link from "next/link";
import type { Metadata } from "next";
import { fetchChampionList } from "@/lib/ddragon";
import { PATCH, cdnChampionSquare } from "@/lib/utils";
import { ChevronRight, Gamepad2, Layers, Shield, Swords, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Builds",
  description: "Explore rotas de builds, itemizacoes principais e campeoes recomendados.",
};

export const revalidate = 3600;

const roleGroups = [
  { id: "Marksman", title: "ADC critico", label: "DPS", description: "Itens de dano continuo, critico e seguranca contra assassinos.", icon: Swords },
  { id: "Mage", title: "Magos de burst", label: "AP", description: "Rotas com mana, penetracao magica, Zhonya e dano explosivo.", icon: Zap },
  { id: "Tank", title: "Frontline", label: "Tank", description: "Armadura, resistencia magica e itens para iniciar ou proteger.", icon: Shield },
  { id: "Support", title: "Suporte utilidade", label: "Peel", description: "Medalhao, Juramento, Redemption e situacionais para proteger carries.", icon: Layers },
];

type SelectedMode = "ranked" | "aram" | "arena" | "casual" | "aram-chaos";

const modeTabs: Array<{ id: SelectedMode; label: string; description: string }> = [
  { id: "ranked", label: "Ranked", description: "Summoner's Rift competitivo." },
  { id: "aram", label: "ARAM", description: "Howling Abyss: poke, sustain e teamfight." },
  { id: "arena", label: "Arena", description: "Duelos 2v2 com foco em sobrevivencia." },
  { id: "casual", label: "Normal", description: "Builds flexiveis para testar." },
  { id: "aram-chaos", label: "ARAM Desordem", description: "Modo acelerado, se estiver ativo." },
];

function normalizeModeParam(value?: string | string[]) {
  const raw = Array.isArray(value) ? value[0] : value;
  return modeTabs.some((mode) => mode.id === raw) ? (raw as SelectedMode) : "ranked";
}

function championHref(id: string, mode: SelectedMode) {
  return `/campeoes/${id}${mode === "ranked" ? "" : `?modo=${mode}`}`;
}

export default async function BuildsPage({ searchParams }: { searchParams?: Promise<{ modo?: string | string[] }> }) {
  const selectedMode = normalizeModeParam((await searchParams)?.modo);
  const mode = modeTabs.find((item) => item.id === selectedMode) ?? modeTabs[0];
  const { data } = await fetchChampionList();
  const champions = Object.values(data);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gold">Build planner</span>
        <h1 className="font-display text-4xl font-black text-text-primary">Builds de {mode.label} para montar antes da partida</h1>
        <p className="max-w-2xl text-text-secondary">
          {mode.description} Escolha um perfil abaixo ou abra qualquer campeao para usar o montador com core, botas e itens situacionais no estilo OP.GG.
        </p>
      </div>

      <div className="glass rounded-lg border border-border p-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {modeTabs.map((item) => {
            const active = item.id === selectedMode;
            return (
              <Link
                key={item.id}
                href={`/builds${item.id === "ranked" ? "" : `?modo=${item.id}`}`}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                  active ? "border-gold bg-gold/10 text-gold" : "border-border bg-elevated/35 text-text-secondary hover:border-border-bright hover:text-text-primary"
                }`}
              >
                <Gamepad2 className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {roleGroups.map(({ id, title, label, description, icon: Icon }) => {
          const picks = champions.filter((champion) => champion.tags.includes(id)).slice(0, 5);

          return (
            <div key={id} className="glass rounded-lg border border-border p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="h-10 w-10 rounded-lg border border-gold/30 bg-gold/10 flex items-center justify-center text-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded border border-border px-2 py-0.5 text-xs font-bold uppercase text-text-muted">{label}</span>
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{description}</p>
              <div className="mt-4 flex -space-x-2">
                {picks.map((champion) => (
                  <Link key={champion.id} href={championHref(champion.id, selectedMode)} className="h-10 w-10 overflow-hidden rounded-full border border-border bg-surface hover:border-gold">
                    <img src={cdnChampionSquare(PATCH, champion.id)} alt={champion.name} className="h-full w-full object-cover" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-lg border border-border p-6">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="font-display text-xl font-bold">Campeoes populares para testar builds</h2>
            <p className="mt-1 text-sm text-text-secondary">Atalho rapido para abrir o montador direto no campeao.</p>
          </div>
          <Link href="/campeoes" className="hidden sm:inline-flex items-center gap-1.5 rounded border border-border px-3 py-2 text-sm text-text-secondary hover:border-border-bright hover:text-text-primary">
            Ver todos
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {champions.slice(0, 18).map((champion) => (
            <Link key={champion.id} href={championHref(champion.id, selectedMode)} className="rounded-lg border border-border bg-elevated/35 p-3 hover:border-gold/60">
              <img src={cdnChampionSquare(PATCH, champion.id)} alt={champion.name} className="aspect-square w-full rounded object-cover" />
              <div className="mt-2 truncate text-sm font-semibold">{champion.name}</div>
              <div className="text-xs text-text-muted">{champion.tags.slice(0, 2).join(" / ")}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

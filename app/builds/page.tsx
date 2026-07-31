import Link from "next/link";
import type { Metadata } from "next";
import { fetchChampionList } from "@/lib/ddragon";
import { PATCH, cdnChampionSquare } from "@/lib/utils";
import { ChevronRight, Layers, Shield, Swords, Zap } from "lucide-react";

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

export default async function BuildsPage() {
  const { data } = await fetchChampionList();
  const champions = Object.values(data);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gold">Build planner</span>
        <h1 className="font-display text-4xl font-black text-text-primary">Builds para montar antes da partida</h1>
        <p className="max-w-2xl text-text-secondary">
          Escolha um perfil abaixo ou abra qualquer campeao para usar o montador com core, botas e itens situacionais no estilo OP.GG.
        </p>
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
                  <Link key={champion.id} href={`/campeoes/${champion.id}`} className="h-10 w-10 overflow-hidden rounded-full border border-border bg-surface hover:border-gold">
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
            <Link key={champion.id} href={`/campeoes/${champion.id}`} className="rounded-lg border border-border bg-elevated/35 p-3 hover:border-gold/60">
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

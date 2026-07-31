import Link from "next/link";
import type { Metadata } from "next";
import { fetchChampionList } from "@/lib/ddragon";
import { createEstimatedMetaPayload } from "@/lib/meta";
import { PATCH } from "@/lib/utils";
import { MetaTierList } from "@/components/meta/MetaTierList";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Meta",
  description: "Tier list por lane com fallback local e conexao Riot API quando configurada.",
};

export const revalidate = 3600;

export default async function MetaPage() {
  const { data } = await fetchChampionList();
  const initialMeta = createEstimatedMetaPayload(Object.values(data), PATCH);

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
              Ranking separado por Top, Jungle, Mid, ADC e Suporte. Quando a Riot API estiver configurada, calculamos a meta com partidas ranqueadas recentes de jogadores high elo.
            </p>
          </div>
          <Link href="/campeoes" className="inline-flex w-fit items-center gap-2 rounded border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/15">
            Explorar campeoes
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <MetaTierList initialMeta={initialMeta} />
    </div>
  );
}

import type { Metadata } from "next";
import { PlayerLookup } from "@/components/player/PlayerLookup";

export const metadata: Metadata = {
  title: "Perfil",
  description: "Busca de invocador e historico de partidas.",
};

export default function EstatisticasPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="relative overflow-hidden rounded-lg border border-border bg-deep px-5 py-10 md:px-8">
        <div className="absolute inset-0 bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lucian_0.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep via-deep/95 to-deep/70" />
        <div className="relative max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gold">Perfil</span>
          <h1 className="font-display text-4xl font-black md:text-5xl">Verifique qualquer jogador.</h1>
          <p className="text-text-secondary md:text-lg">
            Busque Riot IDs em BR, NA, Europa, Coreia e outras regioes. Quando a Riot API estiver configurada, o LOLZIN mostra elo, campeoes assinatura, historico, itens e runas reais.
          </p>
        </div>
      </div>

      <PlayerLookup />
    </div>
  );
}

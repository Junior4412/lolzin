import type { Metadata } from "next";
import { Search, Star, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Perfil",
  description: "Busca de invocador e historico de partidas.",
};

export default function EstatisticasPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gold">Perfil</span>
        <h1 className="font-display text-4xl font-black">Analise seu invocador</h1>
        <p className="max-w-2xl text-text-secondary">
          Area preparada para conectar a Riot API e mostrar elo, historico, melhores campeoes e comparacao entre jogadores.
        </p>
      </div>

      <div className="glass rounded-lg border border-border p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input className="w-full rounded-lg border border-border bg-surface py-3 pl-10 pr-3 outline-none focus:border-gold/60" placeholder="Nome do jogo + #tag" />
          </div>
          <button className="rounded-lg border border-gold/30 bg-gold/10 px-5 py-3 font-semibold text-gold">Buscar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Trophy, title: "Resumo competitivo", text: "Win rate, elo, LP e evolucao recente do jogador." },
          { icon: Star, title: "Campeoes assinatura", text: "Principais picks, KDA medio e builds mais usadas." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="glass rounded-lg border border-border p-5">
            <Icon className="h-6 w-6 text-gold" />
            <h2 className="mt-4 font-display text-xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-text-secondary">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

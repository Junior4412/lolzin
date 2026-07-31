import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Sobre o LOLZIN.",
};

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <span className="text-xs font-bold uppercase tracking-wider text-gold">Sobre</span>
      <h1 className="font-display text-4xl font-black">LOLZIN</h1>
      <div className="glass rounded-lg border border-border p-6 space-y-4 text-text-secondary leading-relaxed">
        <p>
          O LOLZIN e um laboratorio de builds para League of Legends, feito para transformar dados de campeoes, itens,
          runas, counters e matchups em uma experiencia simples de consultar antes da partida.
        </p>
        <p>
          O projeto usa Data Dragon para imagens e dados oficiais, com recomendacoes locais enquanto a camada de
          estatisticas reais por servidor, elo e patch ainda esta sendo conectada.
        </p>
      </div>
    </div>
  );
}

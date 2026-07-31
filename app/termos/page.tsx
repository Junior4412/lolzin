import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos",
  description: "Termos de uso do LOLZIN.",
};

export default function TermosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <span className="text-xs font-bold uppercase tracking-wider text-gold">Legal</span>
      <h1 className="font-display text-4xl font-black">Termos de uso</h1>
      <div className="glass rounded-lg border border-border p-6 space-y-4 text-text-secondary leading-relaxed">
        <p>
          As recomendacoes do LOLZIN sao guias de apoio e nao garantem resultado em partida. Builds devem ser adaptadas
          ao matchup, composicao dos times e estado do jogo.
        </p>
        <p>
          LOLZIN nao e endossado pela Riot Games e nao reflete opinioes oficiais da Riot Games ou de pessoas envolvidas
          na producao de League of Legends.
        </p>
      </div>
    </div>
  );
}

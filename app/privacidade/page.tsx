import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Politica de privacidade do LOLZIN.",
};

export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <span className="text-xs font-bold uppercase tracking-wider text-gold">Legal</span>
      <h1 className="font-display text-4xl font-black">Privacidade</h1>
      <div className="glass rounded-lg border border-border p-6 space-y-4 text-text-secondary leading-relaxed">
        <p>
          O LOLZIN nao solicita senha, codigo de autenticacao ou dados sensiveis da sua conta Riot. Consultas futuras de
          invocador devem usar apenas identificadores publicos, como nome de jogo e tag.
        </p>
        <p>
          Dados tecnicos de navegacao podem ser processados pela plataforma de hospedagem para entregar o site com
          seguranca e desempenho.
        </p>
      </div>
    </div>
  );
}

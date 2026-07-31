import Link from "next/link";
import type { Metadata } from "next";
import { Calculator, ChevronRight, Shield, Swords } from "lucide-react";

export const metadata: Metadata = {
  title: "Simulador",
  description: "Simulador de itemizacao e adaptacao de build.",
};

export default function SimuladorPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gold">Simulador</span>
        <h1 className="font-display text-4xl font-black">Monte a build antes de entrar no jogo</h1>
        <p className="max-w-2xl text-text-secondary">
          O simulador completo entra aqui. Por enquanto, o montador mais avancado ja esta disponivel dentro de cada pagina de campeao.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Calculator, title: "Comparar caminhos", text: "Teste core ofensivo, defensivo e situacional." },
          { icon: Shield, title: "Adaptar defesa", text: "Escolha resistencia contra AD, AP, burst ou controle." },
          { icon: Swords, title: "Fechar dano", text: "Veja quando priorizar penetracao, critico ou sustain." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="glass rounded-lg border border-border p-5">
            <Icon className="h-6 w-6 text-gold" />
            <h2 className="mt-4 font-display text-xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-text-secondary">{text}</p>
          </div>
        ))}
      </div>

      <Link href="/campeoes" className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-sm text-text-secondary hover:border-border-bright hover:text-text-primary">
        Abrir campeoes
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Sword, BarChart2, Zap } from "lucide-react";
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Background Particles/Glow */}
        <div className="absolute inset-0 bg-hero-gradient opacity-60 mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg')] bg-cover bg-center opacity-[0.03] pointer-events-none" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-semibold tracking-wide mb-8 animate-pulse_gold">
            <Zap className="w-4 h-4" />
            <span>Patch 15.14 Disponível</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-6 leading-tight">
            Domine o <span className="text-gold-gradient">Rift</span>. <br className="hidden md:block" />
            Suba de <span className="text-arcane-bright">Elo</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            As builds mais precisas, tier lists atualizadas por patch e estatísticas detalhadas para o servidor BR. 
            Tudo o que você precisa para alcançar o Desafiante.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/campeoes" className="w-full sm:w-auto">
              <Button size="lg" variant="gold" className="w-full sm:w-auto text-lg px-8">
                <Sword className="w-5 h-5 mr-2" />
                Explorar Campeões
              </Button>
            </Link>
            <Link href="/meta" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 bg-surface/50 backdrop-blur">
                <BarChart2 className="w-5 h-5 mr-2" />
                Ver Tier List
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 text-sm text-text-muted flex items-center gap-2">
            Pressione <kbd className="px-2 py-1 bg-elevated border border-border rounded font-mono text-text-secondary">⌘K</kbd> para buscar rapidamente
          </div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-24 border-t border-border/50 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Builds Inteligentes",
              desc: "Não copie cego. Entenda o porquê de cada item com nossa linha do tempo de build por minuto.",
              icon: Layers,
              color: "text-gold",
              bg: "bg-gold/10",
              border: "border-gold/20",
            },
            {
              title: "Análise de Matchup",
              desc: "Descubra quem countera quem e como jogar a fase de rotas com base em milhões de partidas.",
              icon: Sword,
              color: "text-arcane-bright",
              bg: "bg-arcane-bright/10",
              border: "border-arcane-bright/20",
            },
            {
              title: "Simulador de Stats",
              desc: "Monte sua build e veja o dano exato, vida e resistência antes de entrar na partida.",
              icon: BarChart2,
              color: "text-win",
              bg: "bg-win/10",
              border: "border-win/20",
            }
          ].map((feature, i) => (
            <div key={i} className="glass p-8 rounded-xl border-border hover:border-border-bright transition-colors group">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 border ${feature.bg} ${feature.border}`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}

// Emulate Lucide icon import for Layers
function Layers(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 12 12 17 22 12" />
      <polyline points="2 17 12 22 22 17" />
    </svg>
  );
}

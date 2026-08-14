import Link from "next/link";
import { ArrowRight, BarChart2, Crosshair, Gauge, Layers, Search, Shield, Sparkles, Swords, Target, Trophy, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui";
import { PATCH } from "@/lib/utils";

const lanes = [
  { label: "Top", icon: Shield, text: "Tanques, duelistas e side lane." },
  { label: "Jungle", icon: Swords, text: "Rotas, objetivos e pressao de mapa." },
  { label: "Mid", icon: Sparkles, text: "Controle, burst e roaming." },
  { label: "ADC", icon: Target, text: "DPS, kiting e late game." },
  { label: "Suporte", icon: Crosshair, text: "Visao, engage e peel." },
];

const comparison = [
  {
    title: "OP.GG: decisoes por estatistica",
    text: "Tier list por lane, counters, build contra campeao inimigo e leitura por patch/rank.",
    icon: BarChart2,
  },
  {
    title: "Blitz: contexto por modo",
    text: "Abas para ARAM, Arena, ARAM Desordem, pro builds, sinergias e planos rapidos.",
    icon: Trophy,
  },
  {
    title: "LOLZIN: tudo no fluxo BR",
    text: "Build por modo, cartas do Desordem, matchup, sinergia, skill order e perfil Riot ID no mesmo lugar.",
    icon: Gauge,
  },
];

export default function Home() {
  return (
    <div className="rift-shell flex flex-col">
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg')] bg-cover bg-center opacity-45" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,6,14,0.99),rgba(3,6,14,0.76),rgba(3,6,14,0.94)),linear-gradient(180deg,rgba(7,13,26,0.24),rgba(3,6,14,0.96))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-void to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6">
          <div className="max-w-3xl animate-slide-up">
            <div className="section-kicker mb-6">
              <Zap className="h-4 w-4" />
              Patch {PATCH} disponivel
            </div>

            <h1 className="font-display text-5xl font-black leading-[1.05] md:text-7xl">
              Domine o Rift com dados de <span className="text-gold-gradient">campeoes</span>, builds e jogadores.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              LOLZIN junta tier list por rota, builds inspiradas em OP.GG e Blitz, counters, ordem de habilidades e busca real de Riot ID em uma experiencia feita para League of Legends.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/estatisticas">
                <Button size="lg" variant="gold" className="w-full sm:w-auto">
                  <Search className="h-5 w-5" />
                  Buscar jogador
                </Button>
              </Link>
              <Link href="/meta">
                <Button size="lg" variant="outline" className="w-full border-gold/25 bg-surface/70 sm:w-auto">
                  <BarChart2 className="h-5 w-5" />
                  Ver meta por lane
                </Button>
              </Link>
            </div>
          </div>

          <div className="stat-strip mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-lg md:grid-cols-4">
            {[
              ["184", "paginas de campeoes"],
              ["5", "lanes separadas"],
              ["11", "regioes de perfil"],
              ["3", "opcoes por build"],
            ].map(([value, label]) => (
              <div key={label} className="bg-void/60 p-4 backdrop-blur">
                <p className="font-mono text-2xl font-black text-gold">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-14 sm:px-6 md:grid-cols-5">
        {lanes.map(({ label, icon: Icon, text }) => (
          <Link key={label} href="/meta" className="interactive-card group rounded-lg p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-gold/30 bg-gold/10">
              <Icon className="h-5 w-5 text-gold" />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold group-hover:text-gold">{label}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{text}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6">
        <div className="lux-panel rounded-lg p-5 md:p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="section-kicker">Comparativo</span>
              <h2 className="mt-2 font-display text-3xl font-black">OP.GG + Blitz, com foco em decisao rapida</h2>
            </div>
            <Link href="/builds" className="inline-flex w-fit items-center gap-2 rounded border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/15">
              Abrir builds
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {comparison.map(({ title, text, icon: Icon }) => (
              <article key={title} className="interactive-card rounded-lg p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded border border-arcane-bright/25 bg-arcane-bright/10">
                  <Icon className="h-5 w-5 text-arcane-bright" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-text-secondary md:grid-cols-3">
            <div className="mode-pill rounded p-3">
              <Users className="mr-2 inline h-4 w-4 text-arcane-bright" />
              Sinergias e counters na pagina do campeao.
            </div>
            <div className="mode-pill rounded p-3">
              <Sparkles className="mr-2 inline h-4 w-4 text-arcane-bright" />
              ARAM Desordem com cartas quando ha dado curado.
            </div>
            <div className="mode-pill rounded p-3">
              <Target className="mr-2 inline h-4 w-4 text-arcane-bright" />
              Build ajustada contra matchup dificil.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-4 pb-16 sm:px-6 lg:grid-cols-3">
        {[
          {
            href: "/campeoes",
            title: "Campeoes completos",
            text: "Veja todos os campeoes, filtrados por lane principal, tier e popularidade.",
            icon: Swords,
          },
          {
            href: "/builds",
            title: "Builds montaveis",
            text: "Escolha entre linhas meta, anti-frontline, burst, seguranca e situacionais.",
            icon: Layers,
          },
          {
            href: "/estatisticas",
            title: "Perfil de jogador",
            text: "Consulte Riot ID por regiao e veja historico, campeoes e estatisticas recentes.",
            icon: Search,
          },
        ].map(({ href, title, text, icon: Icon }) => (
          <Link key={title} href={href} className="interactive-card group rounded-lg p-6">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition group-hover:opacity-100" />
            <Icon className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-2xl font-bold">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{text}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold">
              Abrir
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

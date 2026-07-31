import Link from "next/link";
import { Zap, Github, Twitter, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <div className="relative w-8 h-8 flex-shrink-0">
                <div className="absolute inset-0 bg-gold rounded rotate-45 opacity-80 group-hover:opacity-100 transition-opacity" />
                <Zap className="absolute inset-0 m-auto w-4 h-4 text-void z-10" />
              </div>
              <span className="font-display text-2xl font-bold tracking-widest text-gold-gradient">
                LOLZIN
              </span>
            </Link>
            <p className="text-text-secondary text-sm max-w-sm mb-6 leading-relaxed">
              A plataforma definitiva para subir de elo no League of Legends. 
              Builds em tempo real, estatísticas precisas e ferramentas exclusivas para o servidor BR.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/Junior4412/lolzin" target="_blank" rel="noreferrer" className="text-text-muted hover:text-gold transition-colors">
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-text-muted hover:text-arcane-bright transition-colors">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-display text-text-primary font-bold mb-4 tracking-wide">Plataforma</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/campeoes" className="text-text-secondary hover:text-gold transition-colors">Campeões</Link></li>
              <li><Link href="/meta" className="text-text-secondary hover:text-gold transition-colors">Meta Tier List</Link></li>
              <li><Link href="/builds" className="text-text-secondary hover:text-gold transition-colors">Explorador de Builds</Link></li>
              <li><Link href="/estatisticas" className="text-text-secondary hover:text-gold transition-colors">Busca de Invocador</Link></li>
              <li><Link href="/simulador" className="text-text-secondary hover:text-gold transition-colors">Simulador <span className="text-[10px] bg-gold/20 text-gold px-1.5 py-0.5 rounded ml-1">Novo</span></Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-display text-text-primary font-bold mb-4 tracking-wide">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/sobre" className="text-text-secondary hover:text-gold transition-colors">Sobre nós</Link></li>
              <li><Link href="/privacidade" className="text-text-secondary hover:text-gold transition-colors">Privacidade</Link></li>
              <li><Link href="/termos" className="text-text-secondary hover:text-gold transition-colors">Termos de uso</Link></li>
              <li><a href="mailto:contato@lolzin.com.br" className="text-text-secondary hover:text-gold transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs text-center md:text-left leading-relaxed">
            LOLZIN isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. 
            <br className="hidden md:block" />
            League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
          </p>
          <p className="text-text-muted text-xs flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-loss inline" /> no Brasil.
          </p>
        </div>
      </div>
    </footer>
  );
}

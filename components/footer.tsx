import Link from "next/link";
import { Swords } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mainFooter">
      <div className="footerContainer">
        <div className="footerInfo">
          <div className="brandLogo">
            <Swords size={18} className="logoIcon" />
            <strong>BUILDS DO JUNIN</strong>
          </div>
          <p className="footerText">
            A melhor central de inteligência para invocadores de League of Legends. Analise builds por modo de jogo e acompanhe suas estatísticas de partida em tempo real.
          </p>
        </div>

        <div className="footerLinksGroup">
          <h4>Navegação</h4>
          <nav className="footerNav">
            <Link href="/">Build Lab</Link>
            <Link href="/estatisticas">Estatísticas</Link>
          </nav>
        </div>

        <div className="footerLegal">
          <p className="copyright">
            © {new Date().getFullYear()} BUILDS DO JUNIN. Todos os direitos reservados.
          </p>
          <p className="riotDisclaimer">
            BUILDS DO JUNIN isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}

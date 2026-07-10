"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Swords, BarChart3 } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname() || "/";

  return (
    <header className="mainHeader">
      <div className="headerContainer">
        <Link href="/" className="logo">
          <div className="logoMark">
            <Swords size={20} />
          </div>
          <div>
            <strong>BUILDS DO JUNIN</strong>
            <span>LoL Portal Lab</span>
          </div>
        </Link>

        <nav className="mainNav">
          <Link href="/" className={pathname === "/" ? "navLink active" : "navLink"}>
            <Swords size={16} />
            <span>Build Lab</span>
          </Link>
          <Link href="/estatisticas" className={pathname.startsWith("/estatisticas") ? "navLink active" : "navLink"}>
            <BarChart3 size={16} />
            <span>Estatísticas</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

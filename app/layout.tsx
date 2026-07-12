import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";

const displayFont = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap"
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "BUILDS DO JUNIN — LoL Build Lab & Estatísticas",
    template: "%s — BUILDS DO JUNIN"
  },
  description:
    "Descubra as melhores builds por modo de jogo, runas, feitiços e plano de jogo para qualquer campeão. Analise seu perfil de invocador no League of Legends.",
  keywords: ["league of legends", "builds", "runas", "lol", "estatísticas", "invocador", "meta"],
  openGraph: {
    title: "BUILDS DO JUNIN — LoL Build Lab & Estatísticas",
    description: "Builds, runas e plano de jogo para qualquer campeão, além de estatísticas completas de invocador.",
    type: "website",
    locale: "pt_BR"
  }
};

export const viewport: Viewport = {
  themeColor: "#03060e"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="antialiased">
        <div className="bgAmbient" aria-hidden="true" />
        <div className="appContainer">
          <Navbar />
          <div className="mainContent">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

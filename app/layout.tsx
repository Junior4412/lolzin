import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import { Providers } from "@/app/providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const displayFont = Cinzel({
  subsets: ["latin"],
  variable: "--font-display-var",
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body-var",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LOLZIN — Builds, Meta & Estatísticas",
    template: "%s | LOLZIN",
  },
  description:
    "A plataforma definitiva de League of Legends para o servidor BR. Builds de meta atualizadas por patch, tier lists, matchups, simulador de itens e estatísticas de invocador.",
  keywords: [
    "league of legends",
    "builds",
    "runas",
    "lol",
    "estatísticas",
    "invocador",
    "meta",
    "tier list",
    "aram",
    "arena",
    "matchups",
    "patch",
    "br",
    "brasil",
  ],
  openGraph: {
    title: "LOLZIN — Builds, Meta & Estatísticas",
    description:
      "A plataforma definitiva de League of Legends para o servidor BR. Builds, tier lists e estatísticas de invocador.",
    type: "website",
    locale: "pt_BR",
    siteName: "LOLZIN",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOLZIN — LoL Builds & Meta",
    description: "Builds atualizadas, tier lists e estatísticas para LoL BR.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#03060e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body className="antialiased bg-void text-text-primary font-body">
        <div className="bg-ambient" aria-hidden="true" />
        <Providers>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

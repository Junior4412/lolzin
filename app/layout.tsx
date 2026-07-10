import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "BUILDS DO JUNIN - LoL Build Lab & Estatísticas",
  description: "Descubra as melhores builds por modo de jogo e analise o perfil de invocadores no League of Legends."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <div className="appContainer">
          <Navbar />
          <div className="mainContent">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

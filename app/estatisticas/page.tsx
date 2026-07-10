"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PlayerDashboardData } from "@/lib/riot";
import PlayerSearch from "@/components/player-search";
import PlayerDashboard from "@/components/player-dashboard";
import { Trophy, HelpCircle, Loader2 } from "lucide-react";

// Componente estatísticas real empacotado em Suspense
function EstatisticasContent() {
  const searchParams = useSearchParams();
  
  const [activePlayer, setActivePlayer] = useState<PlayerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Comparação
  const [player2, setPlayer2] = useState<PlayerDashboardData | null>(null);
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);

  // Histórico e Favoritos
  const [history, setHistory] = useState<{ riotId: string; region: string }[]>([]);
  const [favorites, setFavorites] = useState<{ riotId: string; region: string }[]>([]);

  // Carrega histórico e favoritos no carregamento inicial
  useEffect(() => {
    const savedHistory = localStorage.getItem("lolzin_search_history");
    const savedFavorites = localStorage.getItem("lolzin_favorites");

    // localStorage so existe no client; hidratar esse estado num efeito e o padrao correto aqui.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // Funções de manipulação do histórico
  const addToHistory = (riotId: string, region: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.riotId.toLowerCase() !== riotId.toLowerCase());
      const updated = [{ riotId, region }, ...filtered].slice(0, 5); // Limita a 5 buscas
      localStorage.setItem("lolzin_search_history", JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveHistory = (riotId: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.riotId.toLowerCase() !== riotId.toLowerCase());
      localStorage.setItem("lolzin_search_history", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("lolzin_search_history");
  };

  // Funções de manipulação de favoritos
  const handleToggleFavorite = (riotId: string, region: string) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.riotId.toLowerCase() === riotId.toLowerCase());
      let updated;
      
      if (exists) {
        updated = prev.filter((item) => item.riotId.toLowerCase() !== riotId.toLowerCase());
      } else {
        updated = [...prev, { riotId, region }];
      }
      
      localStorage.setItem("lolzin_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  // Executa busca do jogador principal
  const handleSearch = async (riotId: string, region: string) => {
    setIsLoading(true);
    setError("");
    setPlayer2(null); // Reseta comparação anterior
    
    try {
      const res = await fetch(`/api/player?riotId=${encodeURIComponent(riotId)}&region=${region}`);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao buscar dados do invocador.");
      }

      const playerData: PlayerDashboardData = await res.json();
      setActivePlayer(playerData);
      
      // Adiciona ao histórico local
      addToHistory(riotId, region);
    } catch (e: any) {
      setError(e.message || "Erro desconhecido ao carregar jogador.");
      setActivePlayer(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Executa busca do oponente para comparação
  const handleSearchCompare = async (riotId: string, region: string) => {
    setIsLoadingCompare(true);
    
    try {
      const res = await fetch(`/api/player?riotId=${encodeURIComponent(riotId)}&region=${region}`);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao buscar dados do oponente.");
      }

      const player2Data: PlayerDashboardData = await res.json();
      setPlayer2(player2Data);
    } catch (e: any) {
      alert(e.message || "Erro ao buscar dados do oponente.");
      setPlayer2(null);
    } finally {
      setIsLoadingCompare(false);
    }
  };

  const handleClearCompare = () => {
    setPlayer2(null);
  };

  // Monitora parâmetros da URL para busca automática (ex: links compartilhados)
  useEffect(() => {
    const queryRiotId = searchParams.get("riotId");
    const queryRegion = searchParams.get("region");

    if (queryRiotId && queryRegion) {
      // Busca disparada por link compartilhado (?riotId=...&region=...) - acao pontual no mount,
      // nao e estado que da pra derivar do proprio render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleSearch(queryRiotId, queryRegion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const activeIsFavorite = activePlayer 
    ? favorites.some((item) => item.riotId.toLowerCase() === `${activePlayer.profile.name}#${activePlayer.profile.tag}`.toLowerCase())
    : false;

  return (
    <main className="statsShell">
      <div className="statsHeader container">
        <span className="eyebrow">Histórico & Rank</span>
        <h1>Estatísticas de Jogador</h1>
      </div>

      <div className="statsContent container">
        {/* Barra de busca / Favoritos e histórico */}
        <PlayerSearch
          onSearch={handleSearch}
          isLoading={isLoading}
          history={history}
          favorites={favorites}
          onRemoveHistory={handleRemoveHistory}
          onClearHistory={handleClearHistory}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* Estados da busca */}
        {isLoading && (
          <div className="statusLoadingSection cardGlass">
            <Loader2 size={36} className="spinnerIcon" />
            <p>Conectando aos servidores da Riot Games...</p>
            <small>Carregando perfil, elo e últimas partidas.</small>
          </div>
        )}

        {error && (
          <div className="statusErrorSection cardGlass">
            <Trophy size={36} className="errorIcon" />
            <h3>Ocorreu um erro</h3>
            <p>{error}</p>
            <button onClick={() => setError("")} className="btnCleanError btnGold">Tentar novamente</button>
          </div>
        )}

        {/* Dashboard com dados carregados */}
        {activePlayer && !isLoading && !error && (
          <PlayerDashboard
            data={activePlayer}
            isFavorite={activeIsFavorite}
            onToggleFavorite={() => handleToggleFavorite(`${activePlayer.profile.name}#${activePlayer.profile.tag}`, activePlayer.profile.region.toLowerCase())}
            player2={player2}
            onSearchCompare={handleSearchCompare}
            onClearCompare={handleClearCompare}
            isLoadingCompare={isLoadingCompare}
          />
        )}

        {/* Estado vazio */}
        {!activePlayer && !isLoading && !error && (
          <div className="statsEmptyPlaceholder cardGlass">
            <HelpCircle size={42} className="placeholderIcon" />
            <h3>Nenhum jogador selecionado</h3>
            <p>Selecione um jogador do seu histórico, dos favoritos, ou digite um Riot ID acima para carregar o dashboard estatístico.</p>
          </div>
        )}
      </div>
    </main>
  );
}

// Wrapper principal com Suspense obrigatório para evitar de-opt no build
export default function EstatisticasPage() {
  return (
    <Suspense 
      fallback={
        <div className="statusLoadingSection cardGlass">
          <Loader2 size={36} className="spinnerIcon" />
          <p>Preparando página de estatísticas...</p>
        </div>
      }
    >
      <EstatisticasContent />
    </Suspense>
  );
}

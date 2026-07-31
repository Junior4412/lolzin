"use client";

import { useState } from "react";
import { Search, Star, Trash2, User, Clock, ShieldAlert } from "lucide-react";

interface PlayerSearchProps {
  onSearch: (riotId: string, region: string) => void;
  isLoading: boolean;
  history: { riotId: string; region: string }[];
  favorites: { riotId: string; region: string }[];
  onRemoveHistory: (riotId: string) => void;
  onClearHistory: () => void;
  onToggleFavorite: (riotId: string, region: string) => void;
}

const REGIONS = [
  { value: "br", label: "BR (Brasil)" },
  { value: "na", label: "NA (América do Norte)" },
  { value: "euw", label: "EUW (Europa Oeste)" },
  { value: "eune", label: "EUNE (Europa Nordeste)" },
  { value: "kr", label: "KR (Coréia do Sul)" },
  { value: "jp", label: "JP (Japão)" },
  { value: "las", label: "LAS (Sul da Am. Latina)" },
  { value: "lan", label: "LAN (Norte da Am. Latina)" },
  { value: "oce", label: "OCE (Oceania)" },
  { value: "tr", label: "TR (Turquia)" },
  { value: "ru", label: "RU (Rússia)" }
];

export default function PlayerSearch({
  onSearch,
  isLoading,
  history,
  favorites,
  onRemoveHistory,
  onClearHistory,
  onToggleFavorite
}: PlayerSearchProps) {
  const [riotId, setRiotId] = useState("");
  const [region, setRegion] = useState("br");
  const [inputError, setInputError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError("");

    if (!riotId.trim()) {
      setInputError("Digite o Riot ID.");
      return;
    }

    if (!riotId.includes("#")) {
      setInputError("O Riot ID deve incluir '#' (ex: Junin#BR1).");
      return;
    }

    const parts = riotId.split("#");
    if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
      setInputError("Formato de Riot ID inválido (deve ser Nome#Tag).");
      return;
    }

    onSearch(riotId.trim(), region);
  };

  return (
    <div className="searchSection cardGlass">
      <div className="searchIntro">
        <h2>Estatísticas de Invocadores</h2>
        <p>Busque perfis e veja taxas de vitória, KDA, builds recentes e gráficos detalhados.</p>
      </div>

      <form onSubmit={handleSubmit} className="searchForm">
        <div className="formGroup selectGroup">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            disabled={isLoading}
            className="regionSelect"
          >
            {REGIONS.map((reg) => (
              <option key={reg.value} value={reg.value}>
                {reg.label}
              </option>
            ))}
          </select>
        </div>

        <div className="formGroup inputGroup">
          <div className="inputWithIcon">
            <User size={18} className="inputIcon" />
            <input
              type="text"
              value={riotId}
              onChange={(e) => setRiotId(e.target.value)}
              placeholder="RiotID#TAG (Ex: Junin#BR1)"
              disabled={isLoading}
              className="riotIdInput"
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="btnSearch btnGold">
          <Search size={18} />
          {isLoading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {inputError && (
        <div className="inputValidationError">
          <ShieldAlert size={16} />
          <span>{inputError}</span>
        </div>
      )}

      {/* Grid de Favoritos & Histórico */}
      <div className="searchHistoryGrid">
        {/* Favoritos */}
        <div className="historyCol">
          <h3 className="subTitle">
            <Star size={16} className="starIcon fillStar" />
            Favoritos
          </h3>
          {favorites.length === 0 ? (
            <p className="emptyText">Nenhum jogador favoritado ainda.</p>
          ) : (
            <div className="historyList">
              {favorites.map((fav) => (
                <div key={`${fav.riotId}-${fav.region}`} className="historyItem cardGlass">
                  <button
                    onClick={() => onSearch(fav.riotId, fav.region)}
                    className="historyItemLink"
                  >
                    <span className="histName">{fav.riotId}</span>
                    <span className="histRegion">{fav.region.toUpperCase()}</span>
                  </button>
                  <button
                    onClick={() => onToggleFavorite(fav.riotId, fav.region)}
                    className="btnItemAction removeFavoriteBtn"
                    title="Remover dos favoritos"
                  >
                    <Star size={14} className="fillStar" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Histórico */}
        <div className="historyCol">
          <h3 className="subTitle">
            <Clock size={16} className="historyIcon" />
            Buscas Recentes
            {history.length > 0 && (
              <button onClick={onClearHistory} className="btnClearAll" title="Limpar histórico">
                <Trash2 size={13} />
                Limpar
              </button>
            )}
          </h3>
          {history.length === 0 ? (
            <p className="emptyText">Nenhum jogador pesquisado recentemente.</p>
          ) : (
            <div className="historyList">
              {history.map((hist) => (
                <div key={`${hist.riotId}-${hist.region}`} className="historyItem cardGlass">
                  <button
                    onClick={() => onSearch(hist.riotId, hist.region)}
                    className="historyItemLink"
                  >
                    <span className="histName">{hist.riotId}</span>
                    <span className="histRegion">{hist.region.toUpperCase()}</span>
                  </button>
                  <button
                    onClick={() => onRemoveHistory(hist.riotId)}
                    className="btnItemAction deleteHistoryBtn"
                    title="Excluir do histórico"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

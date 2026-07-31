"use client";

import { useState, useRef } from "react";
import { 
  Trophy, 
  Star, 
  Share2, 
  Download, 
  FileText, 
  User, 
  Eye, 
  Coins, 
  Sword, 
  Clock, 
  Shield, 
  CheckCircle2, 
  BarChart3,
  Calendar
} from "lucide-react";
import { PlayerDashboardData, MatchHistoryItem } from "@/lib/riot";
import PlayerCharts from "./player-charts";
import PlayerComparison from "./player-comparison";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PlayerDashboardProps {
  data: PlayerDashboardData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  // Comparação
  player2: PlayerDashboardData | null;
  onSearchCompare: (riotId: string, region: string) => void;
  onClearCompare: () => void;
  isLoadingCompare: boolean;
}

type TabType = "overview" | "champions" | "history" | "compare";

export default function PlayerDashboard({
  data,
  isFavorite,
  onToggleFavorite,
  player2,
  onSearchCompare,
  onClearCompare,
  isLoadingCompare
}: PlayerDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [shareSuccess, setShareSuccess] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Formata o tempo relativo (ex: "há 3 horas")
  // Esse componente so monta depois de um fetch client-side (nunca durante SSR), entao
  // nao ha risco real de mismatch de hidratacao aqui.
  const getRelativeTime = (timestamp: number) => {
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `há ${minutes} min`;
    }
    if (hours < 24) {
      return `há ${hours}h`;
    }
    const days = Math.floor(hours / 24);
    return `há ${days}d`;
  };

  // Formata a duração da partida (ex: "25:42")
  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Lógica de Compartilhar Link
  const handleShare = () => {
    const url = `${window.location.origin}/estatisticas?riotId=${encodeURIComponent(`${data.profile.name}#${data.profile.tag}`)}&region=${data.profile.region.toLowerCase()}`;
    navigator.clipboard.writeText(url);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  // Exportar Dashboard como Imagem (PNG)
  const handleExportPNG = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        useCORS: true,
        backgroundColor: "#03060e",
        scale: 2
      });
      const link = document.createElement("a");
      link.download = `Estatisticas_${data.profile.name}_${data.profile.tag}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Falha ao exportar imagem:", e);
    }
  };

  // Exportar Dashboard como PDF
  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        useCORS: true,
        backgroundColor: "#03060e",
        scale: 1.5
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // Largura A4
      const pageHeight = 295; // Altura A4
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`Estatisticas_${data.profile.name}_${data.profile.tag}.pdf`);
    } catch (e) {
      console.error("Falha ao exportar PDF:", e);
    }
  };

  return (
    <div className="dashboardContainer" ref={dashboardRef}>
      {/* Topo do Dashboard: Perfil + Ações */}
      <div className="dashboardHeader cardGlass">
        <div className="profileSection">
          <div className="avatarContainer">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/${data.profile.profileIconId}.png`}
              alt="Ícone de Invocador"
              className="profileIcon"
            />
            <span className="profileLevel">{data.profile.level}</span>
          </div>

          <div className="profileInfo">
            <div className="profileTitleRow">
              <h2>{data.profile.name}</h2>
              <span className="profileTag">#{data.profile.tag}</span>
              <span className="regionBadge">{data.profile.region}</span>
            </div>

            <div className="profileEloRow">
              <div className="eloIconWrapper">
                <Trophy size={18} className="goldIcon" />
              </div>
              <div className="eloDetails">
                <strong>{data.profile.tier} {data.profile.rank}</strong>
                <span>{data.profile.leaguePoints} LP / {data.profile.wins}V - {data.profile.losses}D ({data.profile.winRate}% Win Rate)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profileActions">
          <button 
            onClick={onToggleFavorite} 
            className={`btnIcon ${isFavorite ? "favoriteActive" : ""}`}
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Star size={18} className={isFavorite ? "fillStar" : ""} />
            <span>{isFavorite ? "Favoritado" : "Favoritar"}</span>
          </button>
          
          <button onClick={handleShare} className="btnIcon" title="Copiar link de compartilhamento">
            <Share2 size={18} />
            <span>{shareSuccess ? "Copiado!" : "Compartilhar"}</span>
          </button>

          <div className="exportDropdown">
            <button className="btnIcon">
              <Download size={18} />
              <span>Exportar</span>
            </button>
            <div className="exportDropdownMenu">
              <button onClick={handleExportPNG}>
                <FileText size={14} />
                PNG (Imagem)
              </button>
              <button onClick={handleExportPDF}>
                <FileText size={14} />
                PDF (Documento)
              </button>
            </div>
          </div>
        </div>
      </div>

      {shareSuccess && (
        <div className="toastNotification successToast">
          <CheckCircle2 size={16} />
          <span>Link de compartilhamento copiado para a área de transferência!</span>
        </div>
      )}

      {/* Navegação por Abas */}
      <div className="dashboardTabs">
        <button
          onClick={() => setActiveTab("overview")}
          className={activeTab === "overview" ? "tabLink activeTab" : "tabLink"}
        >
          <BarChart3 size={16} />
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab("champions")}
          className={activeTab === "champions" ? "tabLink activeTab" : "tabLink"}
        >
          <Sword size={16} />
          Campeões
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={activeTab === "history" ? "tabLink activeTab" : "tabLink"}
        >
          <Clock size={16} />
          Histórico
        </button>
        <button
          onClick={() => setActiveTab("compare")}
          className={activeTab === "compare" ? "tabLink activeTab" : "tabLink"}
        >
          <Sword size={16} />
          Comparar
        </button>
      </div>

      {/* Conteúdo das Abas */}
      <div className="tabContent">
        {activeTab === "overview" && (
          <div className="overviewTab">
            {/* Cards de Métricas Gerais */}
            <div className="statsGrid">
              <div className="statCard cardGlass">
                <div className="statIconWrapper kdaBg">
                  <Sword size={18} />
                </div>
                <div className="statCardDetails">
                  <span>KDA Médio</span>
                  <strong>{data.stats.kda.ratio} : 1</strong>
                  <small>{data.stats.kda.kills} / {data.stats.kda.deaths} / {data.stats.kda.assists}</small>
                </div>
              </div>

              <div className="statCard cardGlass">
                <div className="statIconWrapper csBg">
                  <Coins size={18} />
                </div>
                <div className="statCardDetails">
                  <span>Farm Médio</span>
                  <strong>{data.stats.csMin} CS/min</strong>
                  <small>Gold: {data.stats.goldMin}/min</small>
                </div>
              </div>

              <div className="statCard cardGlass">
                <div className="statIconWrapper dmgBg">
                  <Trophy size={18} />
                </div>
                <div className="statCardDetails">
                  <span>Média de Dano</span>
                  <strong>{data.stats.damageDealt.toLocaleString("pt-BR")}</strong>
                  <small>Recebido: {data.stats.damageTaken.toLocaleString("pt-BR")}</small>
                </div>
              </div>

              <div className="statCard cardGlass">
                <div className="statIconWrapper visionBg">
                  <Eye size={18} />
                </div>
                <div className="statCardDetails">
                  <span>Visão / Partida</span>
                  <strong>{data.stats.wardsPlaced} Wards</strong>
                  <small>Destruídas: {data.stats.wardsDestroyed}</small>
                </div>
              </div>
            </div>

            {/* Gráficos Recharts */}
            <PlayerCharts data={data} />
          </div>
        )}

        {activeTab === "champions" && (
          <div className="championsTab">
            <div className="championsLayout">
              <div className="championsStatsTableCard cardGlass">
                <h3>Desempenho por Campeão</h3>
                <div className="championsTable">
                  <div className="championsTableHeader">
                    <div>Campeão</div>
                    <div className="textCenter">Partidas</div>
                    <div className="textCenter">Win Rate</div>
                    <div className="textCenter">KDA</div>
                  </div>
                  {data.champions.map((champ) => (
                    <div className="championsTableRow" key={champ.championId}>
                      <div className="champNameCell">
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${champ.championId}.png`}
                          alt={champ.championName}
                          className="champRowIcon"
                        />
                        <strong>{champ.championName}</strong>
                      </div>
                      <div className="textCenter boldText">{champ.games}</div>
                      <div className={`textCenter boldText ${champ.winRate >= 50 ? "greenText" : "redText"}`}>
                        {champ.winRate}%
                        <div className="barProgressBg">
                          <div className="barProgressFill" style={{ width: `${champ.winRate}%`, backgroundColor: champ.winRate >= 50 ? "#3ddc97" : "#ef4444" }}></div>
                        </div>
                      </div>
                      <div className="textCenter">
                        <span className="boldText">{champ.kdaRatio} KDA</span>
                        <div className="subText">{champ.kills} / {champ.deaths} / {champ.assists}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="historyTab">
            <div className="matchHistoryList">
              {data.history.map((match) => (
                <div 
                  className={`matchRow cardGlass ${match.win ? "winRow" : "lossRow"}`} 
                  key={match.matchId}
                >
                  {/* Status do Jogo */}
                  <div className="matchStatus">
                    <span className={`resultText ${match.win ? "winText" : "lossText"}`}>
                      {match.win ? "VITÓRIA" : "DERROTA"}
                    </span>
                    <span className="laneBadge">{match.lane}</span>
                    <span className="matchTime">{getRelativeTime(match.timestamp)}</span>
                    <span className="matchDuration">{formatDuration(match.duration)}</span>
                  </div>

                  {/* Campeão, Spells e Runes */}
                  <div className="matchChampionSection">
                    <div className="champIconWrapper">
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${match.championId}.png`}
                        alt={match.championName}
                        className="matchChampIcon"
                      />
                    </div>
                    <div className="spellRuneContainer">
                      <div className="spellsCol">
                        {match.spells.map((spell, i) => (
                          <img
                            key={i}
                            src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/spell/${spell}.png`}
                            alt=""
                            className="miniSpell"
                            title={spell}
                          />
                        ))}
                      </div>
                      <div className="runesCol">
                        <span className="keystoneBadge" title={`${match.runes.keystone} (${match.runes.primaryStyle})`}>
                          {match.runes.keystone.slice(0, 10)}
                        </span>
                      </div>
                    </div>
                    <strong className="champNameDisplay">{match.championName}</strong>
                  </div>

                  {/* KDA */}
                  <div className="matchKdaSection">
                    <div className="kdaText">
                      <strong>{match.kills}</strong> / <span className="deathsCount">{match.deaths}</span> / <strong>{match.assists}</strong>
                    </div>
                    <span className="kdaRatioText">
                      {((match.kills + match.assists) / Math.max(1, match.deaths)).toFixed(2)} KDA
                    </span>
                  </div>

                  {/* Build de Itens */}
                  <div className="matchItemsSection">
                    <div className="itemsGrid">
                      {Array.from({ length: 6 }).map((_, idx) => {
                        const itemId = match.items[idx];
                        return itemId ? (
                          <img
                            key={idx}
                            src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/${itemId}.png`}
                            alt=""
                            className="matchItemIcon"
                          />
                        ) : (
                          <div key={idx} className="emptyItemSlot"></div>
                        );
                      })}
                      {/* Trinket */}
                      {match.trinket && match.trinket !== "0" ? (
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/${match.trinket}.png`}
                          alt=""
                          className="matchItemIcon trinketIcon"
                        />
                      ) : (
                        <div className="emptyItemSlot trinketIcon"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "compare" && (
          <PlayerComparison
            player1={data}
            player2={player2}
            onSearchCompare={onSearchCompare}
            onClearCompare={onClearCompare}
            isLoadingCompare={isLoadingCompare}
          />
        )}
      </div>
    </div>
  );
}

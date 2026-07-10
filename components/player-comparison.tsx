"use client";

import { useState } from "react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip 
} from "recharts";
import { PlayerDashboardData } from "@/lib/riot";
import { Search, Swords, User, Trophy, ShieldAlert, Award, Star } from "lucide-react";

interface PlayerComparisonProps {
  player1: PlayerDashboardData;
  player2: PlayerDashboardData | null;
  onSearchCompare: (riotId: string, region: string) => void;
  onClearCompare: () => void;
  isLoadingCompare: boolean;
}

const REGIONS = [
  { value: "br", label: "BR (Brasil)" },
  { value: "na", label: "NA" },
  { value: "euw", label: "EUW" },
  { value: "eune", label: "EUNE" },
  { value: "kr", label: "KR" },
  { value: "jp", label: "JP" },
  { value: "las", label: "LAS" },
  { value: "lan", label: "LAN" },
  { value: "oce", label: "OCE" },
  { value: "tr", label: "TR" },
  { value: "ru", label: "RU" }
];

export default function PlayerComparison({
  player1,
  player2,
  onSearchCompare,
  onClearCompare,
  isLoadingCompare
}: PlayerComparisonProps) {
  const [riotId, setRiotId] = useState("");
  const [region, setRegion] = useState(player1.profile.region.toLowerCase());
  const [inputError, setInputError] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
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

    onSearchCompare(riotId.trim(), region);
  };

  // Prepara os dados para o gráfico radar de comparação dupla
  const getRadarCompareData = () => {
    if (!player2) return [];

    const getScore = (p: PlayerDashboardData) => {
      // Normalização idêntica de métricas de 0 a 100
      const farmScore = Math.min(100, Math.round((p.stats.csMin / 9.5) * 100));
      // Dano estimado por min
      const dmgMin = p.stats.damageDealt / 25;
      const dmgScore = Math.min(100, Math.round((dmgMin / 900) * 100));
      // Visão
      const visionScore = Math.min(100, Math.round((p.stats.wardsPlaced / 15) * 100));
      // Objetivos (KP)
      const objScore = Math.min(100, p.stats.kp);
      // Sobrevivência (kda e mortes)
      const deaths = p.stats.kda.deaths || 1;
      const survScore = Math.max(15, Math.min(100, 100 - deaths * 9));

      return { farmScore, dmgScore, visionScore, objScore, survScore };
    };

    const s1 = getScore(player1);
    const s2 = getScore(player2);

    return [
      { subject: "Farm (CS/Min)", [player1.profile.name]: s1.farmScore, [player2.profile.name]: s2.farmScore },
      { subject: "Dano Causado", [player1.profile.name]: s1.dmgScore, [player2.profile.name]: s2.dmgScore },
      { subject: "Visão", [player1.profile.name]: s1.visionScore, [player2.profile.name]: s2.visionScore },
      { subject: "Objetivos (KP%)", [player1.profile.name]: s1.objScore, [player2.profile.name]: s2.objScore },
      { subject: "Sobrevivência", [player1.profile.name]: s1.survScore, [player2.profile.name]: s2.survScore }
    ];
  };

  const radarCompareData = getRadarCompareData();

  // Helper para destacar o vencedor de cada estatística
  const getComparisonClass = (val1: number, val2: number, lowerIsBetter = false) => {
    if (val1 === val2) return "";
    const isWinner = lowerIsBetter ? val1 < val2 : val1 > val2;
    return isWinner ? "winnerStat" : "loserStat";
  };

  return (
    <div className="comparePanel">
      {!player2 ? (
        // Estado inicial de comparação: buscando oponente
        <div className="compareSearchBox cardGlass">
          <div className="compareHeaderIntro">
            <Swords size={28} className="goldGlowIcon" />
            <h3>Comparar Jogador</h3>
            <p>Selecione um oponente para comparar estatísticas gerais e métricas de lane.</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="searchForm compareSearchForm">
            <div className="formGroup selectGroup">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={isLoadingCompare}
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
                  placeholder="Nome#TAG do Oponente"
                  disabled={isLoadingCompare}
                  className="riotIdInput"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoadingCompare} className="btnSearch btnGold">
              <Search size={18} />
              {isLoadingCompare ? "Buscando..." : "Comparar"}
            </button>
          </form>

          {inputError && (
            <div className="inputValidationError">
              <ShieldAlert size={16} />
              <span>{inputError}</span>
            </div>
          )}
        </div>
      ) : (
        // Estado Ativo de Comparação
        <div className="comparisonContainer">
          <div className="compareTopControls">
            <button onClick={onClearCompare} className="btnTextGold">
              ← Comparar outro jogador
            </button>
          </div>

          {/* Cabeçalho de Comparação */}
          <div className="comparisonHeaderGrid">
            <div className="comparePlayerProfileCard cardGlass accentBlueBorder">
              <div className="compareIconWrapper">
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/${player1.profile.profileIconId}.png`}
                  alt=""
                  className="summonerIcon"
                />
                <span className="summonerLevel">{player1.profile.level}</span>
              </div>
              <div className="compareProfileDetails">
                <h3>{player1.profile.name}</h3>
                <span>#{player1.profile.tag}</span>
                <div className="eloBadge inlineElo">
                  <Trophy size={14} />
                  <span>{player1.profile.tier} {player1.profile.rank}</span>
                </div>
              </div>
            </div>

            <div className="compareVsCircle">
              <span>VS</span>
            </div>

            <div className="comparePlayerProfileCard cardGlass accentGoldBorder">
              <div className="compareIconWrapper">
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/${player2.profile.profileIconId}.png`}
                  alt=""
                  className="summonerIcon"
                />
                <span className="summonerLevel">{player2.profile.level}</span>
              </div>
              <div className="compareProfileDetails">
                <h3>{player2.profile.name}</h3>
                <span>#{player2.profile.tag}</span>
                <div className="eloBadge inlineElo">
                  <Trophy size={14} />
                  <span>{player2.profile.tier} {player2.profile.rank}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Estatísticas Detalhadas */}
          <div className="comparisonStatsGrid">
            {/* Tabela de Comparação */}
            <div className="comparisonTableCard cardGlass">
              <h3>Estatísticas Gerais</h3>
              <div className="compareRows">
                <div className="compareRow headerRow">
                  <div>{player1.profile.name}</div>
                  <div className="rowLabel">Atributo</div>
                  <div>{player2.profile.name}</div>
                </div>

                <div className="compareRow">
                  <div className={getComparisonClass(player1.profile.winRate, player2.profile.winRate)}>
                    {player1.profile.winRate}% <small>({player1.profile.wins}V - {player1.profile.losses}D)</small>
                  </div>
                  <div className="rowLabel">Win Rate Geral</div>
                  <div className={getComparisonClass(player2.profile.winRate, player1.profile.winRate)}>
                    {player2.profile.winRate}% <small>({player2.profile.wins}V - {player2.profile.losses}D)</small>
                  </div>
                </div>

                <div className="compareRow">
                  <div className={getComparisonClass(Number(player1.stats.kda.ratio), Number(player2.stats.kda.ratio))}>
                    {player1.stats.kda.ratio} <small>({player1.stats.kda.kills}/{player1.stats.kda.deaths}/{player1.stats.kda.assists})</small>
                  </div>
                  <div className="rowLabel">KDA Médio</div>
                  <div className={getComparisonClass(Number(player2.stats.kda.ratio), Number(player1.stats.kda.ratio))}>
                    {player2.stats.kda.ratio} <small>({player2.stats.kda.kills}/{player2.stats.kda.deaths}/{player2.stats.kda.assists})</small>
                  </div>
                </div>

                <div className="compareRow">
                  <div className={getComparisonClass(player1.stats.csMin, player2.stats.csMin)}>
                    {player1.stats.csMin} cs/min
                  </div>
                  <div className="rowLabel">Farm / min</div>
                  <div className={getComparisonClass(player2.stats.csMin, player1.stats.csMin)}>
                    {player2.stats.csMin} cs/min
                  </div>
                </div>

                <div className="compareRow">
                  <div className={getComparisonClass(player1.stats.goldMin, player2.stats.goldMin)}>
                    {player1.stats.goldMin} g/min
                  </div>
                  <div className="rowLabel">Ouro / min</div>
                  <div className={getComparisonClass(player2.stats.goldMin, player1.stats.goldMin)}>
                    {player2.stats.goldMin} g/min
                  </div>
                </div>

                <div className="compareRow">
                  <div className={getComparisonClass(player1.stats.damageDealt, player2.stats.damageDealt)}>
                    {player1.stats.damageDealt.toLocaleString("pt-BR")}
                  </div>
                  <div className="rowLabel">Dano Causado</div>
                  <div className={getComparisonClass(player2.stats.damageDealt, player1.stats.damageDealt)}>
                    {player2.stats.damageDealt.toLocaleString("pt-BR")}
                  </div>
                </div>

                <div className="compareRow">
                  <div className={getComparisonClass(player1.stats.damageTaken, player2.stats.damageTaken, true)}>
                    {player1.stats.damageTaken.toLocaleString("pt-BR")}
                  </div>
                  <div className="rowLabel">Dano Recebido</div>
                  <div className={getComparisonClass(player2.stats.damageTaken, player1.stats.damageTaken, true)}>
                    {player2.stats.damageTaken.toLocaleString("pt-BR")}
                  </div>
                </div>

                <div className="compareRow">
                  <div className={getComparisonClass(player1.stats.wardsPlaced, player2.stats.wardsPlaced)}>
                    {player1.stats.wardsPlaced}
                  </div>
                  <div className="rowLabel">Wards Colocadas</div>
                  <div className={getComparisonClass(player2.stats.wardsPlaced, player1.stats.wardsPlaced)}>
                    {player2.stats.wardsPlaced}
                  </div>
                </div>

                <div className="compareRow">
                  <div className={getComparisonClass(player1.stats.kp, player2.stats.kp)}>
                    {player1.stats.kp}%
                  </div>
                  <div className="rowLabel">Part. em Kills (KP%)</div>
                  <div className={getComparisonClass(player2.stats.kp, player1.stats.kp)}>
                    {player2.stats.kp}%
                  </div>
                </div>
              </div>
            </div>

            {/* Radar Comparativo */}
            <div className="comparisonRadarCard cardGlass">
              <h3>Distribuição de Habilidades</h3>
              <div className="radarCompareWrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarCompareData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="subject" stroke="#8f9bb3" fontSize={10} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} stroke="rgba(255,255,255,0.05)" />
                    <Radar
                      name={player1.profile.name}
                      dataKey={player1.profile.name}
                      stroke="#5da9e9"
                      fill="#5da9e9"
                      fillOpacity={0.2}
                    />
                    <Radar
                      name={player2.profile.name}
                      dataKey={player2.profile.name}
                      stroke="#c28f2c"
                      fill="#c28f2c"
                      fillOpacity={0.2}
                    />
                    <Tooltip
                      contentStyle={{ background: "#0d121c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

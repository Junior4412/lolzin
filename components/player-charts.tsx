"use client";

import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { PlayerDashboardData, MatchHistoryItem } from "@/lib/riot";
import { Filter, Calendar, BarChart3, LineChart as LucideLineChart, Orbit, PieChart as LucidePieChart } from "lucide-react";

interface PlayerChartsProps {
  data: PlayerDashboardData;
}

const COLORS = {
  blue: "#5da9e9",
  cyan: "#00d8f6",
  gold: "#c28f2c",
  goldLight: "#f1e6c3",
  green: "#3ddc97",
  red: "#ef4444",
  bgLight: "rgba(255, 255, 255, 0.05)",
  border: "rgba(255, 255, 255, 0.1)",
  textMuted: "#8f9bb3"
};

const PIE_COLORS = [COLORS.blue, COLORS.cyan, COLORS.gold, COLORS.green, "#a78bfa"];

export default function PlayerCharts({ data }: PlayerChartsProps) {
  const [matchLimit, setMatchLimit] = useState<5 | 10>(10);
  const [resultFilter, setResultFilter] = useState<"all" | "wins" | "losses">("all");

  // Filtra o histórico de partidas com base nas preferências selecionadas
  const filteredHistory = useMemo(() => {
    let result = [...data.history];
    if (resultFilter === "wins") {
      result = result.filter((m) => m.win);
    } else if (resultFilter === "losses") {
      result = result.filter((m) => !m.win);
    }
    return result.slice(0, matchLimit);
  }, [data.history, matchLimit, resultFilter]);

  // 1 e 6: Gráficos de Campeões (Mais jogados e Vitórias/Derrotas)
  const championChartData = useMemo(() => {
    // Calculado a partir do histórico filtrado para manter os filtros interativos
    const stats: Record<string, { wins: number; losses: number; games: number }> = {};
    
    filteredHistory.forEach((match) => {
      if (!stats[match.championName]) {
        stats[match.championName] = { wins: 0, losses: 0, games: 0 };
      }
      stats[match.championName].games += 1;
      if (match.win) {
        stats[match.championName].wins += 1;
      } else {
        stats[match.championName].losses += 1;
      }
    });

    return Object.entries(stats)
      .map(([name, item]) => ({
        name,
        Partidas: item.games,
        Vitórias: item.wins,
        Derrotas: item.losses
      }))
      .sort((a, b) => b.Partidas - a.Partidas);
  }, [filteredHistory]);

  // 2: Gráfico de Pizza de Lanes
  const laneChartData = useMemo(() => {
    const counts: Record<string, number> = { TOP: 0, JUNGLE: 0, MID: 0, ADC: 0, SUPPORT: 0 };
    filteredHistory.forEach((match) => {
      counts[match.lane] = (counts[match.lane] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0);
  }, [filteredHistory]);

  // 3: Linha de Win Rate no Histórico (Evolução de vitória acumulada)
  const winRateEvolutionData = useMemo(() => {
    const reversed = [...filteredHistory].reverse();
    let winsCount = 0;
    
    return reversed.map((match, idx) => {
      if (match.win) winsCount++;
      const rate = Number(((winsCount / (idx + 1)) * 100).toFixed(0));
      return {
        game: `J ${idx + 1}`,
        "Taxa de Vitória %": rate,
        Resultado: match.win ? "Vitória" : "Derrota"
      };
    });
  }, [filteredHistory]);

  // 4: Radar de Métricas
  const radarData = useMemo(() => {
    // Calcula médias da seleção filtrada
    const totalMatches = filteredHistory.length || 1;
    let totalCs = 0;
    let totalDmgDealt = 0;
    let totalDmgTaken = 0;
    let totalVision = 0;
    let totalKills = 0;
    let totalAssists = 0;
    let totalDeaths = 0;

    filteredHistory.forEach((m) => {
      const durationMin = m.duration / 60;
      // D Dragon mock cs calcula CS total
      // Aqui usamos cs/min e dano da partida para o radar
      // estimando cs min aproximado e dano proporcional
      const kills = m.kills;
      const deaths = m.deaths;
      const assists = m.assists;

      totalKills += kills;
      totalDeaths += deaths;
      totalAssists += assists;

      // Estimamos csMin para cada partida do mock
      // Geralmente csMin varia entre 4 e 9
      totalCs += m.lane === "SUPPORT" ? 1.5 : m.lane === "JUNGLE" ? 6.2 : 7.8;
      totalDmgDealt += m.win ? 22000 : 14000;
      totalDmgTaken += m.win ? 15000 : 18000;
      totalVision += m.lane === "SUPPORT" ? 1.8 : 0.6; // wards por minuto aproximado
    });

    const avgCsMin = totalCs / totalMatches;
    const avgDmgDealtMin = (totalDmgDealt / totalMatches) / 25; // dano por minuto médio
    const avgDmgTakenMin = (totalDmgTaken / totalMatches) / 25;
    const avgVisionMin = totalVision / totalMatches;
    const avgKda = (totalKills + totalAssists) / Math.max(1, totalDeaths);
    const avgDeaths = totalDeaths / totalMatches;
    // Normalização em escala de 0 a 100 para o Radar
    const farmScore = Math.min(100, Math.round((avgCsMin / 9.5) * 100));
    const dmgScore = Math.min(100, Math.round((avgDmgDealtMin / 900) * 100));
    const visionScore = Math.min(100, Math.round((avgVisionMin / 2.0) * 100));
    const objScore = Math.min(100, data.stats.kp); // KP serve como score de objetivos/time
    // Sobrevivência: baseada no KDA e taxa média de mortes por partida
    const survScore = Math.min(100, Math.round(Math.max(15, 100 - (avgDeaths * 10))));

    return [
      { subject: "Farm (CS/Min)", A: farmScore, fullMark: 100 },
      { subject: "Dano Causado", A: dmgScore, fullMark: 100 },
      { subject: "Visão (Wards/Min)", A: visionScore, fullMark: 100 },
      { subject: "Objetivos (KP%)", A: objScore, fullMark: 100 },
      { subject: "Sobrevivência", A: survScore, fullMark: 100 }
    ];
  }, [filteredHistory, data.stats.kp]);

  // 5: Heatmap / Tabela de Desempenho por Dia da Semana
  const weekdayPerformance = useMemo(() => {
    // Dias da semana em português
    const days = [
      { name: "Dom", matches: 0, wins: 0 },
      { name: "Seg", matches: 0, wins: 0 },
      { name: "Ter", matches: 0, wins: 0 },
      { name: "Qua", matches: 0, wins: 0 },
      { name: "Qui", matches: 0, wins: 0 },
      { name: "Sex", matches: 0, wins: 0 },
      { name: "Sáb", matches: 0, wins: 0 }
    ];

    filteredHistory.forEach((match) => {
      const date = new Date(match.timestamp);
      const dayIndex = date.getDay(); // 0 = Dom, 1 = Seg, etc.
      days[dayIndex].matches += 1;
      if (match.win) days[dayIndex].wins += 1;
    });

    return days;
  }, [filteredHistory]);

  return (
    <div className="chartsPanel">
      {/* Barra de Filtros dos Gráficos */}
      <div className="chartsFilterBar cardGlass">
        <div className="filterTitle">
          <Filter size={16} />
          <strong>Filtros dos Gráficos</strong>
        </div>
        <div className="filterControls">
          <div className="btnGroup">
            <button
              onClick={() => setMatchLimit(5)}
              className={matchLimit === 5 ? "active" : ""}
            >
              Últimas 5 partidas
            </button>
            <button
              onClick={() => setMatchLimit(10)}
              className={matchLimit === 10 ? "active" : ""}
            >
              Últimas 10 partidas
            </button>
          </div>

          <div className="btnGroup">
            <button
              onClick={() => setResultFilter("all")}
              className={resultFilter === "all" ? "active" : ""}
            >
              Todas
            </button>
            <button
              onClick={() => setResultFilter("wins")}
              className={resultFilter === "wins" ? "active" : ""}
            >
              Vitórias
            </button>
            <button
              onClick={() => setResultFilter("losses")}
              className={resultFilter === "losses" ? "active" : ""}
            >
              Derrotas
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Gráficos */}
      <div className="chartsGrid">
        {/* Gráfico 1: Campeões mais jogados */}
        <div className="chartCard cardGlass">
          <h3>
            <BarChart3 size={16} />
            Campeões Mais Jogados (Volume)
          </h3>
          <div className="chartWrapper">
            {championChartData.length === 0 ? (
              <p className="noData">Nenhum dado com os filtros atuais.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={championChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke={COLORS.textMuted} fontSize={11} tickLine={false} />
                  <YAxis stroke={COLORS.textMuted} fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#0d121c", border: `1px solid ${COLORS.border}`, borderRadius: "8px" }}
                    itemStyle={{ color: COLORS.cyan }}
                  />
                  <Bar dataKey="Partidas" fill={COLORS.cyan} radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfico 6: Stacked Bar (Vitórias x Derrotas por Campeão) */}
        <div className="chartCard cardGlass">
          <h3>
            <BarChart3 size={16} />
            Resultado de Vitórias x Derrotas
          </h3>
          <div className="chartWrapper">
            {championChartData.length === 0 ? (
              <p className="noData">Nenhum dado com os filtros atuais.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={championChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke={COLORS.textMuted} fontSize={11} tickLine={false} />
                  <YAxis stroke={COLORS.textMuted} fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#0d121c", border: `1px solid ${COLORS.border}`, borderRadius: "8px" }}
                  />
                  <Legend verticalAlign="top" height={36} fontSize={12} iconType="circle" />
                  <Bar dataKey="Vitórias" stackId="a" fill={COLORS.green} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Derrotas" stackId="a" fill={COLORS.red} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfico 2: Pizza de Lanes */}
        <div className="chartCard cardGlass">
          <h3>
            <LucidePieChart size={16} />
            Distribuição de Lanes (Rotas)
          </h3>
          <div className="chartWrapper flexCenter">
            {laneChartData.length === 0 ? (
              <p className="noData">Nenhum dado de lane.</p>
            ) : (
              <div className="pieChartFlex">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={laneChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {laneChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#0d121c", border: `1px solid ${COLORS.border}`, borderRadius: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pieLegend">
                  {laneChartData.map((item, idx) => (
                    <div key={item.name} className="legendItem">
                      <span className="dot" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                      <span className="label">{item.name}</span>
                      <span className="value">({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico 3: Linha do Win Rate nas últimas partidas */}
        <div className="chartCard cardGlass">
          <h3>
            <LucideLineChart size={16} />
            Taxa de Vitória Acumulada (%)
          </h3>
          <div className="chartWrapper">
            {winRateEvolutionData.length === 0 ? (
              <p className="noData">Sem partidas suficientes.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={winRateEvolutionData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="game" stroke={COLORS.textMuted} fontSize={11} tickLine={false} />
                  <YAxis stroke={COLORS.textMuted} fontSize={11} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#0d121c", border: `1px solid ${COLORS.border}`, borderRadius: "8px" }}
                    formatter={(value: any, name: any, props: any) => [
                      `${value}%`,
                      `${name} (R: ${props.payload.Resultado})`
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="Taxa de Vitória %"
                    stroke={COLORS.gold}
                    strokeWidth={3}
                    dot={{ fill: COLORS.gold, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfico 4: Radar de Desempenho */}
        <div className="chartCard cardGlass">
          <h3>
            <Orbit size={16} />
            Radar de Performance (vs. Elite)
          </h3>
          <div className="chartWrapper">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" stroke={COLORS.textMuted} fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" tick={false} />
                <Radar
                  name={data.profile.name}
                  dataKey="A"
                  stroke={COLORS.cyan}
                  fill={COLORS.cyan}
                  fillOpacity={0.25}
                />
                <Tooltip
                  contentStyle={{ background: "#0d121c", border: `1px solid ${COLORS.border}`, borderRadius: "8px" }}
                  formatter={(value) => [`${value} / 100`, "Pontuação"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 5: Heatmap de Volume & Desempenho Semanal */}
        <div className="chartCard cardGlass">
          <h3>
            <Calendar size={16} />
            Desempenho por Dia da Semana
          </h3>
          <div className="chartWrapper flexCenter">
            <div className="heatmapContainer">
              <p className="heatmapInfo">
                A cor do bloco indica a quantidade de partidas (tons escuros a claros). A borda indica o aproveitamento.
              </p>
              <div className="heatmapGrid">
                {weekdayPerformance.map((day) => {
                  const rate = day.matches > 0 ? (day.wins / day.matches) * 100 : 0;
                  
                  // Intensidade de partidas
                  let bgColor = "rgba(255, 255, 255, 0.02)";
                  if (day.matches === 1) bgColor = "rgba(93, 169, 233, 0.15)";
                  else if (day.matches === 2) bgColor = "rgba(93, 169, 233, 0.35)";
                  else if (day.matches > 2) bgColor = "rgba(93, 169, 233, 0.6)";

                  // Borda baseada em winrate
                  let borderStyle = "1px solid rgba(255, 255, 255, 0.05)";
                  if (day.matches > 0) {
                    if (rate >= 60) borderStyle = `2px solid ${COLORS.green}`;
                    else if (rate >= 45) borderStyle = `2px solid ${COLORS.gold}`;
                    else borderStyle = `2px solid ${COLORS.red}`;
                  }

                  return (
                    <div
                      key={day.name}
                      className="heatmapCell"
                      style={{ backgroundColor: bgColor, border: borderStyle }}
                      title={`${day.name}: ${day.matches} partidas, ${day.wins} vitórias (${rate.toFixed(0)}% WR)`}
                    >
                      <span className="dayName">{day.name}</span>
                      <span className="dayMatchesCount">{day.matches} Partidas</span>
                      {day.matches > 0 && <span className="dayWR">{rate.toFixed(0)}% WR</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

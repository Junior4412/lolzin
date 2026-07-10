"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Filter,
  PackageSearch,
  Search,
  Shield,
  Sparkles,
  Star,
  Swords,
  Target,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Build,
  BuildArchetypeId,
  buildArchetypes,
  CatalogItem,
  Champion,
  ChampionAbilityDetails,
  GameMode,
  Matchup,
  championImageUrl,
  ddragonVersion,
  getBuildsFor,
  getModeItems,
  itemImageUrl,
  loadChampionAbilityDetails,
  loadDDragonData,
  modes
} from "@/lib/builds";
import SkillOrderPanel from "./SkillOrderPanel";

const version = ddragonVersion();
type SidebarView = "builds" | "matchups" | "favorites";

export default function BuildExplorer() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [query, setQuery] = useState("");
  const [itemQuery, setItemQuery] = useState("");
  const [mode, setMode] = useState<GameMode>("ranked");
  const [archetype, setArchetype] = useState<BuildArchetypeId>("meta");
  const [selectedId, setSelectedId] = useState("");
  const [activeView, setActiveView] = useState<SidebarView>("builds");
  const [abilityDetails, setAbilityDetails] = useState<ChampionAbilityDetails | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    loadDDragonData()
      .then((data) => {
        if (!mounted) return;
        setChampions(data.champions);
        setItems(data.items);
        setSelectedId(data.champions[0]?.id ?? "");
        setStatus("ready");
      })
      .catch((reason: unknown) => {
        if (!mounted) return;
        setError(reason instanceof Error ? reason.message : "Erro inesperado ao carregar Data Dragon.");
        setStatus("error");
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let mounted = true;

    loadChampionAbilityDetails(selectedId)
      .then((details) => {
        if (mounted) setAbilityDetails(details);
      })
      .catch(() => {
        if (mounted) setAbilityDetails(null);
      });

    return () => {
      mounted = false;
    };
  }, [selectedId]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return champions;

    return champions.filter((champion) => {
      const haystack = [champion.name, champion.title, ...champion.roles, ...champion.tags].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }, [champions, query]);

  const selected = filtered.find((champion) => champion.id === selectedId) ?? filtered[0] ?? champions[0];

  const modeItems = useMemo(() => getModeItems(items, mode), [items, mode]);
  const catalogItems = useMemo(() => {
    const normalized = itemQuery.trim().toLowerCase();
    if (!normalized) return modeItems;

    return modeItems.filter((item) => {
      const haystack = [item.name, item.plaintext, ...item.tags].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }, [itemQuery, modeItems]);


  const recommendations = useMemo(() => {
    if (!selected) return [];
    return getBuildsFor(selected, modeItems, mode, archetype, champions);
  }, [selected, modeItems, mode, archetype, champions]);

  const selectedAbilityDetails = abilityDetails?.championId === selected?.id ? abilityDetails : null;

  if (status === "loading") {
    return <StatusPanel type="loading" title="Carregando meta" text={`Buscando campeões e itens oficiais do Data Dragon ${version}.`} />;
  }

  if (status === "error") {
    return <StatusPanel type="error" title="Data Dragon indisponível" text={error} />;
  }

  return (
    <motion.main 
      className="shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <aside className="sidebar cardGlass" aria-label="Navegacão de Builds">
        <div className="sidebarTitle">
          <Sparkles size={16} className="goldIcon" />
          <span>Filtros do Lab</span>
        </div>

        <div className="navGroup">
          <button className={activeView === "builds" ? "navItem active" : "navItem"} onClick={() => setActiveView("builds")} type="button">
            <Sparkles size={17} />
            Builds
          </button>
          <button className={activeView === "matchups" ? "navItem active" : "navItem"} onClick={() => setActiveView("matchups")} type="button">
            <Target size={17} />
            Matchups
          </button>
          <button className={activeView === "favorites" ? "navItem active" : "navItem"} onClick={() => setActiveView("favorites")} type="button">
            <Shield size={17} />
            Favoritos
          </button>
        </div>

        <div className="sidebarPanel cardGlass">
          <span className="eyebrow">Patch {version}</span>
          <p>
            Todos os campeões e itens vêm do Data Dragon. O meta diferencia Ranked, Normal, ARAM e Arena por mapa,
            classe e regras de modo.
          </p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Recomendador de Build</span>
            <h1>Construa seu plano de jogo e runas.</h1>
          </div>
          <a className="deployLink" href="https://github.com/Junior4412/lolzin" target="_blank" rel="noreferrer">
            GitHub Repo
            <ArrowUpRight size={16} />
          </a>
        </header>

        {/* Controles de Rota, Modo e Estilo */}
        <div className="controlsRow">
          <label className="searchBox cardGlass">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por campeão, rota ou classe"
            />
          </label>

          <div className="modeTabs cardGlass" aria-label="Selecionar modo de jogo">
            {modes.map((item) => (
              <button
                className={item.id === mode ? "selected" : ""}
                key={item.id}
                onClick={() => setMode(item.id)}
                type="button"
                title={item.hint}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="controlsRow secondaryControls">
          <div className="archetypeTabs cardGlass" aria-label="Selecionar estilo de build">
            {buildArchetypes.map((arch) => (
              <button
                className={arch.id === archetype ? "selected" : ""}
                key={arch.id}
                onClick={() => setArchetype(arch.id)}
                type="button"
                title={arch.description}
              >
                {arch.shortLabel}
              </button>
            ))}
          </div>

          <div className="modeStats">
            <span>{champions.length} campeões</span>
            <span>{modeItems.length} itens disponíveis</span>
            <span>Mapa {modes.find((item) => item.id === mode)?.mapId}</span>
          </div>
        </div>

        <div className="contentGrid">
          <section className="championList cardGlass" aria-label="Campeões">
            <div className="sectionHeader">
              <div>
                <span className="eyebrow">Lista de Campeões</span>
                <h2>{filtered.length} encontrados</h2>
              </div>
              <Filter size={18} />
            </div>

            <div className="champions">
              {filtered.map((champion) => (
                <button
                  className={champion.id === selected?.id ? "championRow activeChampion" : "championRow"}
                  key={champion.id}
                  onClick={() => setSelectedId(champion.id)}
                  style={{ "--accent": champion.accent } as React.CSSProperties}
                  type="button"
                >
                  <Image alt="" height={52} src={championImageUrl(champion.id)} unoptimized width={52} />
                  <span>
                    <strong>{champion.name}</strong>
                    <small>
                      {champion.roles.join(" / ")} - {champion.tags.join(" / ")}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          {activeView === "builds" && (
  <AnimatePresence mode="wait">
    {selected && recommendations[0] ? (
      <motion.section
        key={selected.id + "-" + mode + "-" + archetype}
        className="recommendation"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
      >
        <div className="heroChampion cardGlass" style={{ "--accent": selected.accent } as React.CSSProperties}>
          <Image alt={selected.name} height={96} priority src={championImageUrl(selected.id)} unoptimized width={96} className="heroChampImg" />
          <div className="heroInfo">
            <span className="eyebrow">{selected.roles.join(" / ")}</span>
            <h2>{selected.name}</h2>
            <p>{selected.title}</p>
            <div className="tagLine">
              {selected.tags.map((tag) => (
                <span key={tag} className="tagBadge">{tag}</span>
              ))}
            </div>
          </div>
          <div className="score">
            <strong>{recommendations[0].confidence}%</strong>
            <span>confiança</span>
          </div>
        </div>
        <BuildView
          abilityDetails={selectedAbilityDetails}
          catalogItems={catalogItems}
          itemQuery={itemQuery}
          recommendations={recommendations}
          selected={selected}
          setItemQuery={setItemQuery}
        />
      </motion.section>
    ) : null}
  </AnimatePresence>
)}
{activeView === "matchups" && recommendations[0] && (
  <MatchupsView build={recommendations[0]} />
)}
{activeView === "favorites" && recommendations[0] && selected && (
  <FavoritesView build={recommendations[0]} selected={selected} />
)}

        </div>
      </section>
    </motion.main>
  );
}

function BuildView({
  abilityDetails,
  catalogItems,
  itemQuery,
  recommendations,
  selected,
  setItemQuery
}: {
  abilityDetails: ChampionAbilityDetails | null;
  catalogItems: CatalogItem[];
  itemQuery: string;
  recommendations: Build[];
  selected: Champion;
  setItemQuery: (value: string) => void;
}) {
  return (
    <>
      {recommendations.map((build) => (
        <article className="buildPanel cardGlass" key={build.id}>
          <div className="buildHeader">
            <div>
              <span className="pill">{build.style}</span>
              <h3>{build.title}</h3>
              <p>{build.summary}</p>
            </div>
            <div className="meta">
              <span>{build.role}</span>
              <span>{build.difficulty}</span>
            </div>
          </div>

          <div className="itemRows">
            <ItemRow label="Iniciais" items={build.starting} />
            <ItemRow label="Core Items" items={build.core} />
            <ItemRow label="Situacionais" items={build.situational} />
            <ItemRow label="Bota Recomendada" items={build.boots ? [build.boots] : []} />
          </div>

          <div className="detailsGrid">
            <div className="detailBox cardGlass">
              <h4>Runas</h4>
              <p>
                <strong>{build.runes.keystone}</strong> em {build.runes.primary}
              </p>
              <span>
                {build.runes.secondary} - {build.runes.shards}
              </span>
            </div>
            <div className="detailBox cardGlass">
              <h4>Feitiços</h4>
              <p>{build.spells.join(" + ")}</p>
              <span>{build.patchNote}</span>
            </div>
          </div>

          <SkillOrderPanel abilityDetails={abilityDetails} build={build} selected={selected} />

          <div className="playbook">
            <Checklist title="Power spikes" items={build.powerSpikes} />
            <Checklist title="Plano de jogo" items={build.playPattern} />
            <Checklist title="Evitar" items={build.avoid} />
          </div>

          <MatchupPreview build={build} />
        </article>
      ))}

      <section className="catalogPanel cardGlass" aria-label="Catálogo de itens por modo">
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">Catálogo</span>
            <h2>{catalogItems.length} itens do modo</h2>
          </div>
          <PackageSearch size={18} />
        </div>

        <label className="searchBox compactSearch cardGlass">
          <Search size={16} />
          <input
            value={itemQuery}
            onChange={(event) => setItemQuery(event.target.value)}
            placeholder="Filtrar item, atributo ou tag"
          />
        </label>

        <div className="itemCatalogGrid">
          {catalogItems.map((item) => (
            <figure className="tinyItem cardGlass" key={item.id} title={`${item.name} - ${item.total}g`}>
              <Image alt={item.name} height={34} src={itemImageUrl(item.id)} unoptimized width={34} />
              <figcaption>
                <strong>{item.name}</strong>
                <span>{item.total}g - {item.tags.slice(0, 2).join(" / ") || "Item"}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}


function MatchupPreview({ build }: { build: Build }) {
  return (
    <section className="matchupPreview" aria-label="Resumo de matchups">
      <MatchupColumn compact matchups={build.weakAgainst.slice(0, 3)} title="Counters que mais incomodam" variant="danger" />
      <MatchupColumn compact matchups={build.strongAgainst.slice(0, 3)} title="Você costuma punir" variant="good" />
    </section>
  );
}

function MatchupsView({ build }: { build: Build }) {
  return (
    <section className="buildPanel cardGlass">
      <div className="buildHeader">
        <div>
          <span className="pill">Matchups</span>
          <h3>Counters e matchups favoráveis</h3>
          <p>
            Use a primeira lista para banir ou planejar sua fase de rotas defensiva. Use a segunda para pressionar no early game,
            planejar trocas e buscar jogadas ofensivas.
          </p>
        </div>
        <div className="meta">
          <span>{build.role}</span>
          <span>{build.confidence}%</span>
        </div>
      </div>

      <div className="matchupGrid">
        <MatchupColumn matchups={build.weakAgainst} title="Counters do seu campeão" variant="danger" />
        <MatchupColumn matchups={build.strongAgainst} title="Você é melhor contra" variant="good" />
      </div>
    </section>
  );
}

function MatchupColumn({
  compact = false,
  matchups,
  title,
  variant
}: {
  compact?: boolean;
  matchups: Matchup[];
  title: string;
  variant: "danger" | "good";
}) {
  return (
    <div className={compact ? "matchupColumn compactMatchups cardGlass" : "matchupColumn cardGlass"}>
      <h4>{title}</h4>
      {matchups.map((matchup) => (
        <article className={variant === "danger" ? "matchupCard dangerMatchup cardGlass" : "matchupCard goodMatchup cardGlass"} key={matchup.championId}>
          <Image alt="" height={42} src={championImageUrl(matchupImageId(matchup.championId))} unoptimized width={42} />
          <div>
            <strong>{matchup.championName}</strong>
            <span>~{matchup.games.toLocaleString("pt-BR")} partidas</span>
          </div>
          <b>{matchup.winRate}% WR</b>
        </article>
      ))}
    </div>
  );
}

function FavoritesView({ build, selected }: { build: Build; selected: Champion }) {
  return (
    <section className="buildPanel cardGlass">
      <div className="buildHeader">
        <div>
          <span className="pill">Favoritos</span>
          <h3>{selected.name} salvo para consulta rápida</h3>
          <p>Principais informações do campeão selecionado para você bater o olho antes da partida começar.</p>
        </div>
        <Star size={24} className="goldIcon fillStar" />
      </div>

      <div className="favoriteGrid">
        <div className="detailBox cardGlass">
          <h4>Core Items Salvos</h4>
          <p>{build.core.map((item) => item.name).join(" > ")}</p>
          <span>Bota: {build.boots?.name ?? "situacional"}</span>
        </div>
        <div className="detailBox cardGlass">
          <h4>Melhor matchup</h4>
          <p>{build.strongAgainst[0]?.championName ?? "Sem dados"}</p>
          <span>Matchup favorável para acelerar vantagem.</span>
        </div>
        <div className="detailBox cardGlass">
          <h4>Cuidado no draft</h4>
          <p>{build.weakAgainst[0]?.championName ?? "Sem dados"}</p>
          <span>Considere banir ou jogar sob a torre.</span>
        </div>
      </div>
    </section>
  );
}

function matchupImageId(championId: string) {
  const aliases: Record<string, string> = {
    LeBlanc: "Leblanc"
  };

  return aliases[championId] ?? championId;
}

// Painel de status customizado para estados Loading/Error
function StatusPanel({ type, title, text }: { type: "loading" | "error"; title: string; text: string }) {
  return (
    <main className="statusPanel flexCenter">
      <div className="statusCard cardGlass">
        <div className="brandMark">
          {type === "loading" ? (
            <Loader2 size={24} className="spinnerIcon" />
          ) : (
            <AlertTriangle size={24} className="errorIcon" />
          )}
        </div>
        <span className="eyebrow">BUILDS DO JUNIN</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </main>
  );
}

function ItemRow({ label, items }: { label: string; items: CatalogItem[] }) {
  return (
    <div className="itemRow">
      <span>{label}</span>
      <div>
        {items.map((item) => (
          <figure key={item.id} className="itemFigure" title={`${item.name} - ${item.total}g`}>
            <Image alt={item.name} height={40} src={itemImageUrl(item.id)} unoptimized width={40} />
            <figcaption>{item.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="checklist cardGlass">
      <h4>{title}</h4>
      {items.map((item) => (
        <p key={item}>
          <CheckCircle2 size={15} />
          {item}
        </p>
      ))}
    </div>
  );
}

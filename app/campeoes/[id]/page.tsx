import { fetchChampionDetail, fetchChampionList } from "@/lib/ddragon";
import { BuildOptionsPanel, type BuildOption } from "@/components/champion/BuildOptionsPanel";
import {
  PATCH,
  cdnChampionSplash,
  cdnChampionSquare,
  cdnItemImage,
  cdnSpellImage,
  getTierBg,
  getTierColor,
} from "@/lib/utils";
import type { ChampionTier } from "@/types";
import {
  Award,
  BookOpen,
  ChevronRight,
  Shield,
  ShieldAlert,
  Skull,
  Star,
  Target,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

type SkillKey = "Q" | "W" | "E" | "R";
type BasicSkillKey = "Q" | "W" | "E";
type SimpleChampion = { id: string; name: string; title: string; tags: string[] };
type SkillInfo = { key: "P" | SkillKey; name: string; description: string };
type MatchupGuide = {
  championId: string;
  championName: string;
  difficulty: "easy" | "medium" | "hard";
  score: number;
  tips: string[];
};

export async function generateStaticParams() {
  const { data } = await fetchChampionList();
  return Object.keys(data).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const { data } = await fetchChampionDetail(id);
    const champ = data[id];
    return {
      title: `${champ.name} Build, Runas e Counters`,
      description: `Build, runas, ordem de habilidades, counters e matchups favoraveis para ${champ.name} no Patch ${PATCH}.`,
    };
  } catch {
    return { title: "Campeao | LOLZIN" };
  }
}

export const revalidate = 3600;

function cleanText(text: string) {
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function seedOf(text: string) {
  return text.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function inferLane(tags: string[]) {
  if (tags.includes("Marksman")) return "ADC";
  if (tags.includes("Support")) return "Suporte";
  if (tags.includes("Assassin") || tags.includes("Mage")) return "Meio";
  if (tags.includes("Fighter") || tags.includes("Tank")) return "Topo";
  return "Flex";
}

function sharesMatchupPool(a: string[], b: string[]) {
  return inferLane(a) === inferLane(b) || a.some((tag) => b.includes(tag));
}

function basicRankLimit(level: number) {
  if (level >= 9) return 5;
  if (level >= 7) return 4;
  if (level >= 5) return 3;
  if (level >= 3) return 2;
  return 1;
}

function createSkillTimeline(maxOrder: BasicSkillKey[]) {
  const timeline: SkillKey[] = [];
  const ranks: Record<SkillKey, number> = { Q: 0, W: 0, E: 0, R: 0 };

  for (let level = 1; level <= 18; level++) {
    if ([6, 11, 16].includes(level)) {
      timeline.push("R");
      ranks.R += 1;
      continue;
    }

    const limit = basicRankLimit(level);
    const notUnlocked = maxOrder.find((skill) => ranks[skill] === 0);
    const nextSkill = notUnlocked ?? maxOrder.find((skill) => ranks[skill] < limit) ?? maxOrder[0];
    timeline.push(nextSkill);
    ranks[nextSkill] += 1;
  }

  return timeline;
}

function skillDetails(passive: { name: string; description: string }, spells: Array<{ name: string; description: string }>) {
  const keys: SkillKey[] = ["Q", "W", "E", "R"];
  return [
    { key: "P", name: passive.name, description: cleanText(passive.description) },
    ...spells.map((spell, index) => ({
      key: keys[index],
      name: spell.name,
      description: cleanText(spell.description),
    })),
  ] satisfies SkillInfo[];
}

function matchupTips(name: string, difficulty: MatchupGuide["difficulty"]) {
  if (difficulty === "hard") {
    return [
      `Respeite o pico inicial de ${name}; evite troca longa sem cooldown defensivo.`,
      "Jogue a wave perto do seu lado e compre resistencia se ele abrir vantagem.",
    ];
  }

  if (difficulty === "easy") {
    return [
      `Pressione ${name} quando a habilidade principal dele estiver em recarga.`,
      "Use a prioridade para resetar antes, pegar placa ou rodar para objetivo.",
    ];
  }

  return [
    `Contra ${name}, a lane depende bastante de quem erra o primeiro cooldown grande.`,
    "Segure seu all-in para o nivel 6 ou para quando o cacador inimigo aparecer no mapa.",
  ];
}

function createMatchups(id: string, tags: string[], champions: SimpleChampion[]) {
  const seed = seedOf(id);
  const candidates = champions.filter((champion) => champion.id !== id && sharesMatchupPool(tags, champion.tags));
  const pool = candidates.length >= 8 ? candidates : champions.filter((champion) => champion.id !== id);
  const scored = pool
    .map((champion) => {
      const score = 44 + ((seed * seedOf(champion.id)) % 130) / 10;
      return { champion, score };
    })
    .sort((a, b) => a.score - b.score);

  const hard = scored.slice(0, 4).map(({ champion, score }) => {
    const difficulty = score < 48 ? "hard" : "medium";
    return {
      championId: champion.id,
      championName: champion.name,
      difficulty,
      score: Number(score.toFixed(1)),
      tips: matchupTips(champion.name, difficulty),
    } satisfies MatchupGuide;
  });

  const easy = scored.slice(-4).reverse().map(({ champion, score }) => {
    const difficulty = score > 53 ? "easy" : "medium";
    return {
      championId: champion.id,
      championName: champion.name,
      difficulty,
      score: Number(score.toFixed(1)),
      tips: matchupTips(champion.name, difficulty),
    } satisfies MatchupGuide;
  });

  return { hard, easy };
}

function getChampionBuildData(id: string, tags: string[], allChampions: SimpleChampion[]) {
  const seed = seedOf(id);
  const isMage = tags.includes("Mage");
  const isAssassin = tags.includes("Assassin");
  const isMarksman = tags.includes("Marksman");
  const isTank = tags.includes("Tank");
  const isSupport = tags.includes("Support");
  const isFighter = tags.includes("Fighter");

  const winRate = 0.46 + (seed % 90) / 1000;
  const pickRate = 0.005 + (seed % 150) / 1000;
  const banRate = pickRate * 0.8;
  const tier: ChampionTier = seed % 10 === 0 ? "S+" : seed % 7 === 0 ? "S" : seed % 3 === 0 ? "A" : seed % 2 === 0 ? "B" : "C";

  let startingItems = ["1054", "2003"];
  let coreItems = ["3071", "3053", "3153"];
  let boots = "3047";
  let situationalItems = ["3075", "3068", "6665"];
  let primaryPath = "Precision";
  let keystone = "Conqueror";
  let secondaryPath = "Resolve";
  let runes = ["Triumph", "Legend: Alacrity", "Last Stand", "Second Wind", "Overgrowth"];
  let shards: [string, string, string] = ["Attack Speed", "Adaptive Force", "Health per Level"];
  let maxOrder: BasicSkillKey[] = ["Q", "E", "W"];

  if (isMage || (isAssassin && !isFighter && seed % 2 === 0)) {
    startingItems = ["1056", "2003", "2003"];
    coreItems = ["6655", "3089", "3151"];
    boots = "3020";
    situationalItems = ["3157", "3135", "3001"];
    primaryPath = "Sorcery";
    keystone = "Arcane Comet";
    secondaryPath = "Inspiration";
    runes = ["Manaflow Band", "Transcendence", "Scorch", "Triple Tonic", "Cosmic Insight"];
    shards = ["Adaptive Force", "Adaptive Force", "Armor"];
  } else if (isMarksman) {
    startingItems = ["1055", "2003"];
    coreItems = ["6672", "3031", "3072"];
    boots = "3006";
    situationalItems = ["3036", "3046", "3153"];
    primaryPath = "Precision";
    keystone = "Press the Attack";
    secondaryPath = "Inspiration";
    runes = ["Presence of Mind", "Legend: Bloodline", "Cut Down", "Magical Footwear", "Cosmic Insight"];
    shards = ["Attack Speed", "Adaptive Force", "Armor"];
  } else if (isTank) {
    startingItems = ["1054", "2003"];
    coreItems = ["3068", "6665", "3075"];
    boots = "3111";
    situationalItems = ["3109", "4401", "3001"];
    primaryPath = "Resolve";
    keystone = "Grasp of the Undying";
    secondaryPath = "Precision";
    runes = ["Shield Bash", "Second Wind", "Revitalize", "Triumph", "Legend: Tenacity"];
    shards = ["Ability Haste", "Armor", "Health per Level"];
    maxOrder = ["W", "Q", "E"];
  } else if (isSupport) {
    startingItems = ["3850", "2003", "2003"];
    coreItems = ["2065", "3107", "3190"];
    boots = "3158";
    situationalItems = ["3504", "3110", "3222"];
    primaryPath = "Sorcery";
    keystone = "Summon Aery";
    secondaryPath = "Inspiration";
    runes = ["Manaflow Band", "Transcendence", "Gathering Storm", "Biscuit Delivery", "Cosmic Insight"];
    shards = ["Ability Haste", "Adaptive Force", "Magic Resist"];
    maxOrder = ["E", "W", "Q"];
  }

  if (seed % 3 === 1 && !isSupport) maxOrder = ["W", "Q", "E"];
  if (seed % 3 === 2 && !isTank) maxOrder = ["E", "Q", "W"];

  const spell1 = isSupport ? "SummonerExhaust" : isMage || isMarksman ? "SummonerFlash" : "SummonerTeleport";
  const spell2 = isSupport ? "SummonerFlash" : isMage || isAssassin ? "SummonerDot" : "SummonerFlash";
  const spell1Img = spell1 === "SummonerTeleport" ? "SummonerTeleport.png" : spell1 === "SummonerExhaust" ? "SummonerExhaust.png" : "SummonerFlash.png";
  const spell2Img = spell2 === "SummonerDot" ? "SummonerDot.png" : "SummonerFlash.png";

  return {
    winRate,
    pickRate,
    banRate,
    tier,
    lane: inferLane(tags),
    spells: [spell1Img, spell2Img],
    runes: { primaryPath, keystone, secondaryPath, runes, shards },
    items: { starting: startingItems, core: coreItems, boots, situational: situationalItems },
    skillTimeline: createSkillTimeline(maxOrder),
    maxOrder,
    matchups: createMatchups(id, tags, allChampions),
  };
}

function uniqueItems(items: string[]) {
  return items.filter((item, index) => item && items.indexOf(item) === index);
}

function createBuildOptions(id: string, tags: string[], traits: ReturnType<typeof getChampionBuildData>) {
  const seed = seedOf(id);
  const rate = (base: number, offset: number) => Number((base + ((seed + offset) % 32) / 10).toFixed(1));
  const games = (base: number, offset: number) => base + ((seed * offset) % 3800);
  const starting = traits.items.starting;
  const baseCore = traits.items.core;
  const baseBoots = [traits.items.boots];
  const situational = traits.items.situational;

  let options: BuildOption[];

  if (tags.includes("Support")) {
    options = [
      {
        id: "opgg-main",
        label: "Peel mais jogado",
        badge: "Mais usado",
        description: "Linha parecida com a do OP.GG: protecao, utilidade e teamfight.",
        pickRate: rate(34, 3),
        winRate: rate(51.2, 11),
        games: games(18000, 17),
        starting,
        boots: uniqueItems([traits.items.boots, "3047", "3111"]).slice(0, 3),
        core: uniqueItems(["3190", "3109", baseCore[0], baseCore[1]]).slice(0, 3),
        situational: uniqueItems(["3075", "3110", "3222", "3504", "3001", ...situational]).slice(0, 6),
      },
      {
        id: "hard-engage",
        label: "Engage e pickoff",
        badge: "Agressiva",
        description: "Para jogar andando primeiro, forcando pick e iniciacao curta.",
        pickRate: rate(18, 7),
        winRate: rate(50.6, 19),
        games: games(9200, 23),
        starting,
        boots: uniqueItems(["3158", traits.items.boots, "3047"]).slice(0, 3),
        core: uniqueItems(["2065", "3190", "3107", baseCore[0]]).slice(0, 3),
        situational: uniqueItems(["3109", "3110", "3222", "3075", ...situational]).slice(0, 6),
      },
      {
        id: "anti-carry",
        label: "Anti-carry",
        badge: "Seguro",
        description: "Para sobreviver a assassinos, reduzir burst e manter seu carry vivo.",
        pickRate: rate(12, 13),
        winRate: rate(52, 29),
        games: games(6400, 31),
        starting,
        boots: uniqueItems(["3047", "3111", traits.items.boots]).slice(0, 3),
        core: uniqueItems(["3109", "3190", "3075", baseCore[0]]).slice(0, 3),
        situational: uniqueItems(["3110", "3222", "3001", "3065", ...situational]).slice(0, 6),
      },
    ];
  } else if (tags.includes("Marksman")) {
    options = [
      {
        id: "crit-dps",
        label: "Critico DPS",
        badge: "Mais usado",
        description: "Caminho padrao de atirador: primeiro spike forte e escala para dano continuo.",
        pickRate: rate(31, 5),
        winRate: rate(50.8, 11),
        games: games(22000, 17),
        starting,
        boots: uniqueItems([traits.items.boots, "3006", "3047"]).slice(0, 3),
        core: uniqueItems([baseCore[0], "3031", "3036", baseCore[1]]).slice(0, 3),
        situational: uniqueItems(["3072", "3094", "3046", "3153", ...situational]).slice(0, 6),
      },
      {
        id: "anti-frontline",
        label: "Anti-frontline",
        badge: "Tanques",
        description: "Para derreter vida alta, armadura e composicoes com duas frentes.",
        pickRate: rate(16, 7),
        winRate: rate(51.4, 23),
        games: games(9800, 19),
        starting,
        boots: uniqueItems(["3006", traits.items.boots]).slice(0, 2),
        core: uniqueItems(["3153", "6672", "3036", baseCore[0]]).slice(0, 3),
        situational: uniqueItems(["3124", "3094", "3072", "3139", ...situational]).slice(0, 6),
      },
      {
        id: "survive-burst",
        label: "Sobreviver ao burst",
        badge: "Seguro",
        description: "Troca um pouco de teto de dano por escudo, sustain e margem contra assassinos.",
        pickRate: rate(11, 13),
        winRate: rate(50.9, 31),
        games: games(7200, 29),
        starting,
        boots: uniqueItems(["3047", traits.items.boots, "3111"]).slice(0, 3),
        core: uniqueItems([baseCore[0], "3072", "3026", baseCore[1]]).slice(0, 3),
        situational: uniqueItems(["3139", "3156", "3036", "3094", ...situational]).slice(0, 6),
      },
    ];
  } else if (tags.includes("Mage") || tags.includes("Assassin")) {
    options = [
      {
        id: "burst-meta",
        label: "Burst meta",
        badge: "Mais usado",
        description: "Dano imediato para pickoff, wave clear e controle antes do objetivo.",
        pickRate: rate(28, 3),
        winRate: rate(50.7, 11),
        games: games(16000, 17),
        starting,
        boots: uniqueItems([traits.items.boots, "3020", "3158"]).slice(0, 3),
        core: uniqueItems([baseCore[0], "3089", "3135", baseCore[1]]).slice(0, 3),
        situational: uniqueItems(["3157", "3102", "3116", "4628", ...situational]).slice(0, 6),
      },
      {
        id: "safe-control",
        label: "Controle seguro",
        badge: "Consistente",
        description: "Mais utilidade e defesa para lutas longas sem perder pressao de rota.",
        pickRate: rate(15, 7),
        winRate: rate(51.1, 19),
        games: games(8600, 23),
        starting,
        boots: uniqueItems(["3158", traits.items.boots, "3020"]).slice(0, 3),
        core: uniqueItems([baseCore[0], "3157", "3116", baseCore[1]]).slice(0, 3),
        situational: uniqueItems(["3135", "3102", "3089", "6653", ...situational]).slice(0, 6),
      },
      {
        id: "snowball",
        label: "Snowball",
        badge: "Agressiva",
        description: "Compra gananciosa para acelerar abates e fechar o jogo cedo.",
        pickRate: rate(10, 13),
        winRate: rate(50.4, 29),
        games: games(5900, 31),
        starting,
        boots: uniqueItems(["3020", traits.items.boots]).slice(0, 2),
        core: uniqueItems(["4645", baseCore[0], "3089", baseCore[1]]).slice(0, 3),
        situational: uniqueItems(["3157", "3135", "3102", "4628", ...situational]).slice(0, 6),
      },
    ];
  } else if (tags.includes("Tank")) {
    options = [
      {
        id: "frontline",
        label: "Frontline padrao",
        badge: "Mais usado",
        description: "Vida, resistencias e presenca para iniciar ou segurar entrada inimiga.",
        pickRate: rate(30, 5),
        winRate: rate(51.3, 11),
        games: games(14000, 17),
        starting,
        boots: uniqueItems([traits.items.boots, "3047", "3111"]).slice(0, 3),
        core: uniqueItems([baseCore[0], baseCore[1], "3075", "3068"]).slice(0, 3),
        situational: uniqueItems(["3110", "4401", "3143", "3065", ...situational]).slice(0, 6),
      },
      {
        id: "anti-ad",
        label: "Contra AD",
        badge: "Armadura",
        description: "Quando o inimigo tem atirador forte, duelista fisico ou composicao full AD.",
        pickRate: rate(17, 7),
        winRate: rate(52, 23),
        games: games(7900, 19),
        starting,
        boots: uniqueItems(["3047", traits.items.boots]).slice(0, 2),
        core: uniqueItems(["3068", "3075", "3110", baseCore[0]]).slice(0, 3),
        situational: uniqueItems(["3143", "6665", "3065", "4401", ...situational]).slice(0, 6),
      },
      {
        id: "anti-ap",
        label: "Contra AP",
        badge: "MR",
        description: "Para lobbies com magos fortes, poke ou dano magico em area.",
        pickRate: rate(13, 13),
        winRate: rate(51.7, 31),
        games: games(6100, 29),
        starting,
        boots: uniqueItems(["3111", traits.items.boots]).slice(0, 2),
        core: uniqueItems(["4401", "3065", baseCore[1], baseCore[0]]).slice(0, 3),
        situational: uniqueItems(["3001", "6665", "3075", "3110", ...situational]).slice(0, 6),
      },
    ];
  } else {
    options = [
      {
        id: "bruiser-meta",
        label: "Lutador meta",
        badge: "Mais usado",
        description: "Dano consistente, vida e bom spike de dois itens para side lane.",
        pickRate: rate(29, 5),
        winRate: rate(50.9, 11),
        games: games(15000, 17),
        starting,
        boots: uniqueItems([traits.items.boots, "3047", "3111"]).slice(0, 3),
        core: uniqueItems([baseCore[0], baseCore[1], baseCore[2], "3053"]).slice(0, 3),
        situational: uniqueItems(["6333", "3156", "3074", "3026", ...situational]).slice(0, 6),
      },
      {
        id: "duel-side",
        label: "Duelista side",
        badge: "Split",
        description: "Mais pressao lateral para ganhar 1v1 e puxar duas pessoas.",
        pickRate: rate(16, 7),
        winRate: rate(51.5, 23),
        games: games(8100, 19),
        starting,
        boots: uniqueItems(["3047", traits.items.boots, "3111"]).slice(0, 3),
        core: uniqueItems(["3078", "3153", "3074", baseCore[0]]).slice(0, 3),
        situational: uniqueItems(["6333", "3053", "3156", "3026", ...situational]).slice(0, 6),
      },
      {
        id: "teamfight",
        label: "Teamfight",
        badge: "Seguro",
        description: "Menos gananciosa, melhor para entrar depois do controle inimigo.",
        pickRate: rate(12, 13),
        winRate: rate(51.1, 31),
        games: games(6500, 29),
        starting,
        boots: uniqueItems(["3111", "3047", traits.items.boots]).slice(0, 3),
        core: uniqueItems([baseCore[0], "3053", "6333", baseCore[1]]).slice(0, 3),
        situational: uniqueItems(["3156", "3026", "3075", "3065", ...situational]).slice(0, 6),
      },
    ];
  }

  return options;
}

function MatchupCard({ matchup, tone }: { matchup: MatchupGuide; tone: "danger" | "success" }) {
  return (
    <div className="rounded-lg border border-border bg-elevated/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-surface flex-shrink-0">
            <img src={cdnChampionSquare(PATCH, matchup.championId)} alt={matchup.championName} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-text-primary truncate">{matchup.championName}</div>
            <div className="text-xs text-text-muted font-mono">{matchup.score.toFixed(1)}% estimado</div>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded border text-xs font-bold uppercase ${tone === "danger" ? "bg-loss/10 text-loss border-loss/30" : "bg-win/10 text-win border-win/30"}`}>
          {matchup.difficulty}
        </span>
      </div>
      <div className="mt-3 space-y-1.5 text-xs text-text-secondary leading-relaxed">
        {matchup.tips.map((tip) => (
          <p key={tip}>{tip}</p>
        ))}
      </div>
    </div>
  );
}

export default async function ChampionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ data }, championList] = await Promise.all([fetchChampionDetail(id), fetchChampionList()]);
  const champ = data[id];

  if (!champ) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Campeao nao encontrado</h1>
        <Link href="/campeoes" className="text-gold hover:underline mt-4 inline-block">
          Voltar para campeoes
        </Link>
      </div>
    );
  }

  const allChampions = Object.values(championList.data);
  const traits = getChampionBuildData(champ.id, champ.tags, allChampions);
  const abilities = skillDetails(champ.passive, champ.spells);
  const buildOptions = createBuildOptions(champ.id, champ.tags, traits);
  const splashUrl = cdnChampionSplash(champ.id, 0);
  const priorityLabel = traits.maxOrder.join(" > ");

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full py-16 md:py-24 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.16] pointer-events-none scale-105" style={{ backgroundImage: `url('${splashUrl}')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/95 to-void pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden border-2 border-gold/40 shadow-lg flex-shrink-0">
            <img src={cdnChampionSquare(PATCH, champ.id)} alt={champ.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border backdrop-blur-md ${getTierBg(traits.tier)} ${getTierColor(traits.tier)}`}>
                Tier {traits.tier}
              </span>
              <span className="px-2 py-0.5 rounded bg-gold/10 border border-gold/20 text-gold text-xs uppercase tracking-wide">{traits.lane}</span>
              {champ.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded bg-surface border border-border text-text-secondary text-xs uppercase tracking-wide">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-black text-text-primary tracking-tight">{champ.name}</h1>
            <p className="text-lg md:text-xl text-gold font-semibold italic capitalize tracking-wide">{champ.title}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-surface/50 backdrop-blur-md border border-border p-4 rounded-lg shadow-card w-full md:w-auto">
            <div className="text-center px-2">
              <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Win Rate</div>
              <div className="text-win font-mono text-xl font-bold">{(traits.winRate * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center px-2 border-x border-border">
              <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Pick Rate</div>
              <div className="text-text-primary font-mono text-xl font-bold">{(traits.pickRate * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center px-2">
              <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Ban Rate</div>
              <div className="text-loss font-mono text-xl font-bold">{(traits.banRate * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="glass p-6 rounded-lg border border-border space-y-6">
            <h2 className="font-display text-xl font-bold border-b border-border pb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-gold" />
              Configuracao recomendada
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-secondary">Feiticos de invocador</h3>
                <div className="flex items-center gap-3">
                  {traits.spells.map((spell) => (
                    <div key={spell} className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-surface">
                      <img src={cdnSpellImage(PATCH, spell)} alt="Summoner Spell" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="text-xs text-text-muted max-w-xs">Padrao recomendado para a rota principal do campeao.</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-secondary">Prioridade de maximizar</h3>
                <div className="flex items-center gap-2">
                  {traits.maxOrder.map((skill, idx) => (
                    <div key={skill} className="flex items-center">
                      <div className="w-10 h-10 rounded bg-elevated border border-border flex items-center justify-center font-display font-bold text-lg text-gold">{skill}</div>
                      {idx < traits.maxOrder.length - 1 && <ChevronRight className="w-4 h-4 text-text-muted mx-1" />}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-text-muted">Plano: upe {priorityLabel}, colocando R nos niveis 6, 11 e 16.</p>
              </div>
            </div>
          </div>

          <BuildOptionsPanel championName={champ.name} patch={PATCH} options={buildOptions} />

          <div className="glass p-6 rounded-lg border border-border space-y-6">
            <h2 className="font-display text-xl font-bold border-b border-border pb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              Build de itens
            </h2>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Itens iniciais</h3>
                <div className="flex flex-wrap gap-3">
                  {traits.items.starting.map((itemId, idx) => (
                    <div key={`${itemId}-${idx}`} className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-surface hover:border-gold/50 transition-colors">
                      <img src={cdnItemImage(PATCH, `${itemId}.png`)} alt="Item inicial" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Core build</h3>
                <div className="flex flex-wrap gap-3 items-center">
                  {traits.items.core.map((itemId, idx) => (
                    <div key={itemId} className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gold/20 bg-surface hover:border-gold transition-colors">
                        <img src={cdnItemImage(PATCH, `${itemId}.png`)} alt="Core item" className="w-full h-full object-cover" />
                      </div>
                      {idx < traits.items.core.length - 1 && <ChevronRight className="w-4 h-4 text-text-muted" />}
                    </div>
                  ))}
                  <div className="w-4" />
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-border bg-surface hover:border-gold/50 transition-colors">
                    <img src={cdnItemImage(PATCH, `${traits.items.boots}.png`)} alt="Botas" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Situacionais</h3>
                <div className="flex flex-wrap gap-3">
                  {traits.items.situational.map((itemId) => (
                    <div key={itemId} className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-surface hover:border-gold/50 transition-colors">
                      <img src={cdnItemImage(PATCH, `${itemId}.png`)} alt="Item situacional" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-lg border border-border space-y-6">
            <h2 className="font-display text-xl font-bold border-b border-border pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" />
              Ordem de habilidades
            </h2>

            <div className="overflow-x-auto">
              <div className="min-w-[660px] space-y-2 select-none">
                {(["Q", "W", "E", "R"] as SkillKey[]).map((skillKey) => (
                  <div key={skillKey} className="flex items-center">
                    <div className="w-8 h-8 rounded bg-elevated border border-border font-bold text-sm flex items-center justify-center flex-shrink-0 mr-3">{skillKey}</div>
                    <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}>
                      {traits.skillTimeline.map((timelineSkill, idx) => {
                        const active = timelineSkill === skillKey;
                        return (
                          <div key={`${skillKey}-${idx}`} className={`aspect-square rounded text-[10px] font-mono font-bold flex items-center justify-center ${active ? "bg-gold text-void shadow-gold-sm" : "bg-surface/50 border border-border/40 text-text-muted"}`}>
                            {active ? idx + 1 : ""}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="flex items-center pt-1 border-t border-border/30">
                  <div className="w-8 mr-3 flex-shrink-0" />
                  <div className="flex-1 grid gap-1 text-center font-mono text-xs text-text-muted" style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}>
                    {Array.from({ length: 18 }).map((_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {abilities.map((ability) => (
                <div key={ability.key} className="rounded-lg border border-border bg-elevated/35 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded bg-gold/10 border border-gold/30 text-gold font-bold flex items-center justify-center">{ability.key}</span>
                    <div className="font-semibold text-text-primary">{ability.name}</div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{ability.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <div className="glass p-6 rounded-lg border border-border space-y-6">
            <h2 className="font-display text-xl font-bold border-b border-border pb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-gold" />
              Runas recomendadas
            </h2>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gold uppercase tracking-wider">Primaria</span>
                <span className="text-sm font-semibold">{traits.runes.primaryPath}</span>
              </div>
              <div className="bg-elevated/50 border border-border p-3.5 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold-gradient text-void flex items-center justify-center font-bold text-xs">K</div>
                  <span className="text-sm font-bold">{traits.runes.keystone}</span>
                </div>
                <div className="pl-10 space-y-1">
                  {traits.runes.runes.slice(0, 3).map((rune) => (
                    <div key={rune} className="text-xs text-text-secondary">{rune}</div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Secundaria</span>
                <span className="text-sm font-semibold">{traits.runes.secondaryPath}</span>
              </div>
              <div className="bg-elevated/50 border border-border p-3.5 rounded-lg space-y-1">
                {traits.runes.runes.slice(3).map((rune) => (
                  <div key={rune} className="text-xs text-text-secondary">{rune}</div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-border/30">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Atributos</span>
                {traits.runes.shards.map((shard) => (
                  <div key={shard} className="text-xs text-text-secondary">{shard}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-lg border border-border space-y-6">
            <h2 className="font-display text-xl font-bold border-b border-border pb-3 flex items-center gap-2">
              <Skull className="w-5 h-5 text-gold" />
              Counters e matchups
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-loss font-semibold text-sm">
                <ShieldAlert className="w-4 h-4" />
                Campeoes que counteram {champ.name}
              </div>
              {traits.matchups.hard.map((matchup) => (
                <MatchupCard key={matchup.championId} matchup={matchup} tone="danger" />
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-border/40">
              <div className="flex items-center gap-2 text-win font-semibold text-sm">
                <Target className="w-4 h-4" />
                Campeoes que voce e melhor contra
              </div>
              {traits.matchups.easy.map((matchup) => (
                <MatchupCard key={matchup.championId} matchup={matchup} tone="success" />
              ))}
            </div>

            <div className="rounded-lg border border-gold/20 bg-gold/10 p-3 text-xs text-gold/90 leading-relaxed flex gap-2">
              <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" />
              Estimativa local baseada em classe, rota e seed deterministica ate conectar estatisticas reais de partidas.
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

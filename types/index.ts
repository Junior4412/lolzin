// ============================================================
// LOLZIN V2 — Global Types
// ============================================================

// --- DDragon Base Types ---

export interface DDragonVersion {
  version: string;
  patch: string;
}

export interface DDragonChampion {
  id: string;
  key: string;
  name: string;
  title: string;
  tags: string[];
  stats: ChampionStats;
  image: { full: string };
  blurb: string;
  partype: string;
}

export interface DDragonChampionDetail extends DDragonChampion {
  skins: Skin[];
  spells: Spell[];
  passive: Passive;
  lore: string;
  allytips: string[];
  enemytips: string[];
}

export interface ChampionStats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeed: number;
  attackspeedperlevel: number;
}

export interface Skin {
  id: string;
  num: number;
  name: string;
  chromas: boolean;
}

export interface Spell {
  id: string;
  name: string;
  description: string;
  image: { full: string };
  cooldown: number[];
  cost: number[];
  range: number[];
}

export interface Passive {
  name: string;
  description: string;
  image: { full: string };
}

export interface DDragonItem {
  name: string;
  description: string;
  gold: { base: number; total: number; sell: number; purchasable: boolean };
  image: { full: string };
  tags: string[];
  stats: Record<string, number>;
  depth?: number;
  from?: string[];
  into?: string[];
}

// --- App Champion Types ---

export type ChampionRole = "top" | "jungle" | "mid" | "adc" | "support" | "fill" | "Top" | "Jungle" | "Mid" | "ADC" | "Support" | "Fill";
export type ChampionTier = "S+" | "S" | "A" | "B" | "C" | "D";
export type GameMode = "sr" | "aram" | "arena" | "urf" | "aram-chaos";

export interface ChampionMeta {
  id: string;
  name: string;
  tier: ChampionTier;
  winRate: number;
  pickRate: number;
  banRate: number;
  trend: "up" | "down" | "stable";
  roles: ChampionRole[];
  tags: string[];
}

// --- Build Types ---

export interface CatalogItem {
  id: string;
  name: string;
  nameEn?: string;
  cost: number;
  image: string;
  tags: string[];
  stats: Record<string, number>;
  description: string;
}

export interface BuildRune {
  primaryPath: string;
  primaryKey: string;
  secondaryPath: string;
  secondaryKey: string;
  shards: [string, string, string];
}

export interface SummonerSpell {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface BuildProfile {
  mode: GameMode;
  role: ChampionRole;
  items: string[];
  startItems: string[];
  boots: string;
  runes: BuildRune;
  spells: [string, string];
  skillOrder: ("Q" | "W" | "E" | "R")[];
  powerSpikes: PowerSpike[];
  tips: string[];
  playstyle: string;
}

export interface PowerSpike {
  minute: number;
  items: string[];
  description: string;
}

export interface ChampionBuild {
  championId: string;
  patch: string;
  builds: BuildProfile[];
  matchups: MatchupData[];
  synergies: SynergyData[];
}

export interface MatchupData {
  championId: string;
  difficulty: "easy" | "medium" | "hard";
  tips: string[];
  score: number; // 0-100, lower = harder
}

export interface SynergyData {
  championId: string;
  strength: "good" | "great" | "excellent";
  description: string;
  score: number; // 0-100
}

// --- Player Types ---

export interface SummonerProfile {
  puuid: string;
  gameName: string;
  tagLine: string;
  profileIconId: number;
  summonerLevel: number;
  rank?: RankedInfo;
}

export interface RankedInfo {
  tier: string;
  division: string;
  lp: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface MatchHistory {
  matchId: string;
  champion: string;
  role: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  cs: number;
  duration: number;
  timestamp: number;
  items: number[];
}

// --- Search Types ---

export interface SearchResult {
  type: "champion" | "player" | "item";
  id: string;
  name: string;
  image?: string;
  subtitle?: string;
}

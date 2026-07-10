export type GameMode = "ranked" | "aram" | "arena" | "casual" | "aram-chaos";

export type ChampionRole = "Top" | "Jungle" | "Mid" | "ADC" | "Support";

export type Champion = {
  id: string;
  name: string;
  title: string;
  roles: ChampionRole[];
  tags: string[];
  accent: string;
};

export type CatalogItem = {
  id: string;
  name: string;
  plaintext: string;
  tags: string[];
  stats: Record<string, number>;
  total: number;
  maps: Record<string, boolean>;
  consumed: boolean;
  inStore: boolean;
  depth?: number;
  into?: string[];
  from?: string[];
};

export type BuildArchetypeId = "meta" | "critico" | "letalidade" | "ap-burst" | "on-hit" | "bruiser" | "tank" | "suporte";

export type BuildArchetype = {
  id: BuildArchetypeId;
  label: string;
  shortLabel: string;
  description: string;
  tags: string[];
  preferredItems: string[];
  runePreset: {
    primary: string;
    keystone: string;
    secondary: string;
    shards: string;
  };
};

export type Build = {
  id: string;
  champion: string;
  archetype: BuildArchetype;
  title: string;
  mode: GameMode;
  role: ChampionRole;
  style: "Meta" | "Scaling" | "Snowball" | "Utility" | "Burst" | "Duel" | "Critical" | "Lethality";
  difficulty: "Easy" | "Medium" | "Hard";
  confidence: number;
  patchNote: string;
  summary: string;
  starting: CatalogItem[];
  core: CatalogItem[];
  situational: CatalogItem[];
  boots?: CatalogItem;
  runes: {
    primary: string;
    keystone: string;
    secondary: string;
    shards: string;
  };
  spells: string[];
  powerSpikes: string[];
  playPattern: string[];
  avoid: string[];
  skillOrder: string[];
  strongAgainst: Matchup[];
  weakAgainst: Matchup[];
};

export type Matchup = {
  championId: string;
  championName: string;
  winRate: number;
  games: number;
};

export type ChampionAbility = {
  key: "P" | "Q" | "W" | "E" | "R";
  name: string;
  description: string;
};

export type ChampionAbilityDetails = {
  championId: string;
  passive: ChampionAbility;
  abilities: ChampionAbility[];
};

type ChampionMetaProfile = {
  role: ChampionRole;
  style: Build["style"];
  difficulty?: Build["difficulty"];
  confidence: number;
  source: string;
  starting: string[];
  boots: string[];
  core: string[];
  situational: string[];
  runes: Build["runes"];
  spells?: string[];
  skillOrder?: string[];
  notes: string;
};

type DDragonChampion = {
  id: string;
  name: string;
  title: string;
  tags: string[];
};

type DDragonChampionResponse = {
  data: Record<string, DDragonChampion>;
};

type DDragonChampionDetail = DDragonChampion & {
  passive: {
    name: string;
    description: string;
  };
  spells: Array<{
    name: string;
    description: string;
    tooltip?: string;
  }>;
};

type DDragonChampionDetailResponse = {
  data: Record<string, DDragonChampionDetail>;
};

type DDragonItem = {
  name: string;
  plaintext?: string;
  tags?: string[];
  stats?: Record<string, number>;
  gold?: {
    total: number;
    purchasable: boolean;
  };
  maps?: Record<string, boolean>;
  consumed?: boolean;
  inStore?: boolean;
  depth?: number;
  into?: string[];
  from?: string[];
};

type DDragonItemResponse = {
  data: Record<string, DDragonItem>;
};

export type DDragonData = {
  champions: Champion[];
  items: CatalogItem[];
};

export const modes: Array<{ id: GameMode; label: string; hint: string; mapId: string }> = [
  { id: "ranked", label: "Ranked", hint: "Summoner's Rift com escolhas consistentes", mapId: "11" },
  { id: "aram", label: "ARAM", hint: "Howling Abyss, luta constante e poke", mapId: "12" },
  { id: "arena", label: "Arena", hint: "Ringue 2v2v2v2, duelos e sustain", mapId: "30" },
  { id: "casual", label: "Normal Game", hint: "Summoner's Rift com espaco para testar", mapId: "11" },
  { id: "aram-chaos", label: "ARAM Desordem", hint: "Modo caótico com itens rápidos e sustain", mapId: "12" }
];

const accents = ["#2dd4bf", "#5da9e9", "#e9c46a", "#f97316", "#d946ef", "#3ddc97", "#ef4444"];

const roleByTag: Record<string, ChampionRole[]> = {
  Marksman: ["ADC"],
  Mage: ["Mid"],
  Assassin: ["Mid"],
  Fighter: ["Top", "Jungle"],
  Tank: ["Top", "Support"],
  Support: ["Support"]
};

const rolePriority: ChampionRole[] = ["Top", "Jungle", "Mid", "ADC", "Support"];

const starterNames = new Set([
  "Doran's Blade",
  "Doran's Ring",
  "Doran's Shield",
  "Cull",
  "World Atlas",
  "Health Potion",
  "Refillable Potion",
  "Guardian's Blade",
  "Guardian's Hammer",
  "Guardian's Horn",
  "Guardian's Orb"
]);

const bootNames = new Set([
  "Berserker's Greaves",
  "Boots of Swiftness",
  "Ionian Boots of Lucidity",
  "Mercury's Treads",
  "Plated Steelcaps",
  "Sorcerer's Shoes",
  "Symbiotic Soles"
]);

const curatedBoosts: Record<string, Partial<Record<string, number>>> = {
  Marksman: {
    "Infinity Edge": 18,
    "Kraken Slayer": 16,
    "Runaan's Hurricane": 12,
    "Lord Dominik's Regards": 10,
    "Bloodthirster": 10
  },
  Mage: {
    "Rabadon's Deathcap": 18,
    "Luden's Echo": 16,
    "Shadowflame": 14,
    "Zhonya's Hourglass": 12,
    "Void Staff": 10
  },
  Assassin: {
    "Youmuu's Ghostblade": 16,
    "Voltaic Cyclosword": 14,
    "Opportunity": 12,
    "Serylda's Grudge": 12,
    "Edge of Night": 10
  },
  Fighter: {
    "Black Cleaver": 16,
    "Sundered Sky": 15,
    "Sterak's Gage": 14,
    "Death's Dance": 12,
    "Spirit Visage": 10
  },
  Tank: {
    "Heartsteel": 16,
    "Sunfire Aegis": 14,
    "Mortal Reminder": 8,
    "Jak'Sho, The Protean": 14,
    "Thornmail": 12,
    "Kaenic Rookern": 12
  },
  Support: {
    "Locket of the Iron Solari": 16,
    "Redemption": 14,
    "Knight's Vow": 12,
    "Moonstone Renewer": 12,
    "Trailblazer": 10
  }
};

const runePresets = {
  conqueror: { primary: "Precision", keystone: "Conqueror", secondary: "Resolve", shards: "Attack Speed, Adaptive, Scaling Health" },
  grasp: { primary: "Resolve", keystone: "Grasp of the Undying", secondary: "Inspiration", shards: "Attack Speed, Adaptive, Scaling Health" },
  pta: { primary: "Precision", keystone: "Press the Attack", secondary: "Inspiration", shards: "Attack Speed, Adaptive, Health" },
  lethalTempo: { primary: "Precision", keystone: "Lethal Tempo", secondary: "Resolve", shards: "Attack Speed, Adaptive, Health" },
  fleet: { primary: "Precision", keystone: "Fleet Footwork", secondary: "Sorcery", shards: "Attack Speed, Adaptive, Health" },
  hail: { primary: "Domination", keystone: "Hail of Blades", secondary: "Precision", shards: "Attack Speed, Adaptive, Health" },
  electrocute: { primary: "Domination", keystone: "Electrocute", secondary: "Sorcery", shards: "Adaptive, Adaptive, Health" },
  firstStrike: { primary: "Inspiration", keystone: "First Strike", secondary: "Sorcery", shards: "Adaptive, Adaptive, Health" },
  phaseRush: { primary: "Sorcery", keystone: "Phase Rush", secondary: "Inspiration", shards: "Ability Haste, Adaptive, Health" },
  comet: { primary: "Sorcery", keystone: "Arcane Comet", secondary: "Inspiration", shards: "Ability Haste, Adaptive, Health" },
  aery: { primary: "Sorcery", keystone: "Summon Aery", secondary: "Resolve", shards: "Ability Haste, Adaptive, Health" },
  aftershock: { primary: "Resolve", keystone: "Aftershock", secondary: "Inspiration", shards: "Ability Haste, Armor/MR, Health" },
  guardian: { primary: "Resolve", keystone: "Guardian", secondary: "Inspiration", shards: "Ability Haste, Armor/MR, Health" },
  darkHarvest: { primary: "Domination", keystone: "Dark Harvest", secondary: "Sorcery", shards: "Adaptive, Adaptive, Health" }
} satisfies Record<string, Build["runes"]>;

const metaSource = "Consenso OP.GG, DeepLoL e LeagueOfGraphs; itens validados contra Data Dragon.";

const championMetaOverrides: Record<string, Partial<ChampionMetaProfile> & Pick<ChampionMetaProfile, "role" | "core" | "runes">> = {
  Aatrox: { role: "Top", core: ["Eclipse", "Sundered Sky", "Sterak's Gage"], runes: runePresets.conqueror },
  Ahri: { role: "Mid", core: ["Luden's Echo", "Horizon Focus", "Rabadon's Deathcap"], runes: runePresets.electrocute },
  Akali: { role: "Mid", core: ["Stormsurge", "Shadowflame", "Zhonya's Hourglass"], runes: runePresets.electrocute },
  Ambessa: { role: "Top", core: ["Eclipse", "Sundered Sky", "Black Cleaver"], runes: runePresets.conqueror },
  Amumu: { role: "Jungle", core: ["Liandry's Torment", "Sunfire Aegis", "Jak'Sho, The Protean"], runes: runePresets.conqueror },
  Anivia: { role: "Mid", core: ["Rod of Ages", "Archangel's Staff", "Liandry's Torment"], runes: runePresets.comet },
  Aphelios: { role: "ADC", core: ["Yun Tal Wildarrows", "Infinity Edge", "Lord Dominik's Regards"], runes: runePresets.pta },
  Ashe: { role: "ADC", core: ["Statikk Shiv", "Kraken Slayer", "Infinity Edge"], runes: runePresets.pta },
  AurelionSol: { role: "Mid", core: ["Rod of Ages", "Rylai's Crystal Scepter", "Liandry's Torment"], runes: runePresets.comet },
  Azir: { role: "Mid", core: ["Nashor's Tooth", "Shadowflame", "Rabadon's Deathcap"], runes: runePresets.lethalTempo },
  Bard: { role: "Support", core: ["Bloodsong", "Locket of the Iron Solari", "Redemption"], runes: runePresets.guardian },
  Belveth: { role: "Jungle", core: ["Kraken Slayer", "Stridebreaker", "Terminus"], runes: runePresets.conqueror },
  Blitzcrank: { role: "Support", core: ["Celestial Opposition", "Locket of the Iron Solari", "Zeke's Convergence"], runes: runePresets.aftershock },
  Brand: { role: "Support", core: ["Blackfire Torch", "Liandry's Torment", "Rylai's Crystal Scepter"], runes: runePresets.darkHarvest },
  Braum: { role: "Support", core: ["Celestial Opposition", "Locket of the Iron Solari", "Knight's Vow"], runes: runePresets.guardian },
  Briar: { role: "Jungle", core: ["Eclipse", "Sundered Sky", "Black Cleaver"], runes: runePresets.pta },
  Caitlyn: { role: "ADC", core: ["The Collector", "Infinity Edge", "Rapid Firecannon"], runes: runePresets.fleet },
  Camille: { role: "Top", core: ["Trinity Force", "Ravenous Hydra", "Sterak's Gage"], runes: runePresets.grasp },
  Cassiopeia: { role: "Mid", core: ["Rod of Ages", "Seraph's Embrace", "Rylai's Crystal Scepter"], runes: runePresets.conqueror },
  Chogath: { role: "Top", core: ["Heartsteel", "Sunfire Aegis", "Unending Despair"], runes: runePresets.grasp },
  Corki: { role: "Mid", core: ["Trinity Force", "Manamune", "Rapid Firecannon"], runes: runePresets.fleet },
  Darius: { role: "Top", core: ["Stridebreaker", "Sterak's Gage", "Dead Man's Plate"], runes: runePresets.conqueror },
  Diana: { role: "Jungle", core: ["Nashor's Tooth", "Shadowflame", "Zhonya's Hourglass"], runes: runePresets.conqueror },
  Draven: { role: "ADC", core: ["The Collector", "Infinity Edge", "Bloodthirster"], runes: runePresets.pta },
  Ekko: { role: "Jungle", core: ["Lich Bane", "Nashor's Tooth", "Rabadon's Deathcap"], runes: runePresets.darkHarvest },
  Ezreal: { role: "ADC", core: ["Trinity Force", "Manamune", "Serylda's Grudge"], runes: runePresets.pta },
  Fiora: { role: "Top", core: ["Ravenous Hydra", "Trinity Force", "Hullbreaker"], runes: runePresets.grasp },
  Fizz: { role: "Mid", core: ["Lich Bane", "Zhonya's Hourglass", "Rabadon's Deathcap"], runes: runePresets.electrocute },
  Galio: { role: "Mid", core: ["Hollow Radiance", "Riftmaker", "Zhonya's Hourglass"], runes: runePresets.aftershock },
  Gangplank: { role: "Top", core: ["Trinity Force", "The Collector", "Infinity Edge"], runes: runePresets.firstStrike },
  Garen: { role: "Top", core: ["Stridebreaker", "Phantom Dancer", "Dead Man's Plate"], runes: runePresets.conqueror },
  Gragas: { role: "Top", core: ["Rod of Ages", "Cosmic Drive", "Zhonya's Hourglass"], runes: runePresets.grasp },
  Graves: { role: "Jungle", core: ["Youmuu's Ghostblade", "The Collector", "Infinity Edge"], runes: runePresets.fleet },
  Gwen: { role: "Top", core: ["Riftmaker", "Nashor's Tooth", "Rabadon's Deathcap"], runes: runePresets.conqueror },
  Hecarim: { role: "Jungle", core: ["Eclipse", "Black Cleaver", "Spear of Shojin"], runes: runePresets.conqueror },
  Hwei: { role: "Mid", core: ["Blackfire Torch", "Liandry's Torment", "Horizon Focus"], runes: runePresets.comet },
  Irelia: { role: "Top", core: ["Blade of The Ruined King", "Kraken Slayer", "Wit's End"], runes: runePresets.conqueror },
  Janna: { role: "Support", core: ["Dream Maker", "Moonstone Renewer", "Redemption"], runes: runePresets.aery },
  JarvanIV: { role: "Jungle", core: ["Sundered Sky", "Black Cleaver", "Sterak's Gage"], runes: runePresets.conqueror },
  Jax: { role: "Top", core: ["Trinity Force", "Sundered Sky", "Sterak's Gage"], runes: runePresets.lethalTempo },
  Jhin: { role: "ADC", core: ["The Collector", "Infinity Edge", "Rapid Firecannon"], runes: runePresets.fleet },
  Jinx: { role: "ADC", core: ["Yun Tal Wildarrows", "Runaan's Hurricane", "Infinity Edge"], runes: runePresets.lethalTempo },
  Kaisa: { role: "ADC", core: ["Statikk Shiv", "Guinsoo's Rageblade", "Nashor's Tooth"], runes: runePresets.pta },
  Kalista: { role: "ADC", core: ["Blade of The Ruined King", "Guinsoo's Rageblade", "Terminus"], runes: runePresets.lethalTempo },
  Karma: { role: "Support", core: ["Dream Maker", "Moonstone Renewer", "Shurelya's Battlesong"], runes: runePresets.aery },
  Karthus: { role: "Jungle", core: ["Blackfire Torch", "Liandry's Torment", "Rabadon's Deathcap"], runes: runePresets.darkHarvest },
  Kassadin: { role: "Mid", core: ["Malignance", "Seraph's Embrace", "Rabadon's Deathcap"], runes: runePresets.fleet },
  Katarina: { role: "Mid", core: ["Nashor's Tooth", "Shadowflame", "Zhonya's Hourglass"], runes: runePresets.electrocute },
  Kayle: { role: "Top", core: ["Nashor's Tooth", "Riftmaker", "Rabadon's Deathcap"], runes: runePresets.lethalTempo },
  Kayn: { role: "Jungle", core: ["Eclipse", "Black Cleaver", "Serylda's Grudge"], runes: runePresets.conqueror },
  Khazix: { role: "Jungle", core: ["Youmuu's Ghostblade", "Opportunity", "Serylda's Grudge"], runes: runePresets.darkHarvest },
  Kindred: { role: "Jungle", core: ["Kraken Slayer", "Trinity Force", "Infinity Edge"], runes: runePresets.pta },
  KogMaw: { role: "ADC", core: ["Blade of The Ruined King", "Guinsoo's Rageblade", "Runaan's Hurricane"], runes: runePresets.lethalTempo },
  Leblanc: { role: "Mid", core: ["Luden's Echo", "Shadowflame", "Rabadon's Deathcap"], runes: runePresets.electrocute },
  LeeSin: { role: "Jungle", core: ["Eclipse", "Sundered Sky", "Black Cleaver"], runes: runePresets.conqueror },
  Leona: { role: "Support", core: ["Celestial Opposition", "Locket of the Iron Solari", "Zeke's Convergence"], runes: runePresets.aftershock },
  Lillia: { role: "Jungle", core: ["Blackfire Torch", "Liandry's Torment", "Rylai's Crystal Scepter"], runes: runePresets.conqueror },
  Lucian: { role: "ADC", core: ["Essence Reaver", "Infinity Edge", "Navori Flickerblade"], runes: runePresets.pta },
  Lulu: { role: "Support", core: ["Dream Maker", "Moonstone Renewer", "Ardent Censer"], runes: runePresets.aery },
  Lux: { role: "Support", core: ["Luden's Echo", "Horizon Focus", "Rabadon's Deathcap"], runes: runePresets.comet },
  Malphite: { role: "Top", core: ["Sunfire Aegis", "Thornmail", "Jak'Sho, The Protean"], runes: runePresets.grasp },
  Malzahar: { role: "Mid", core: ["Blackfire Torch", "Rylai's Crystal Scepter", "Liandry's Torment"], runes: runePresets.comet },
  MasterYi: { role: "Jungle", core: ["Blade of The Ruined King", "Guinsoo's Rageblade", "Wit's End"], runes: runePresets.lethalTempo },
  Milio: { role: "Support", core: ["Dream Maker", "Moonstone Renewer", "Ardent Censer"], runes: runePresets.aery },
  MissFortune: { role: "ADC", core: ["Youmuu's Ghostblade", "The Collector", "Serylda's Grudge"], runes: runePresets.pta },
  Mordekaiser: { role: "Top", core: ["Rylai's Crystal Scepter", "Riftmaker", "Liandry's Torment"], runes: runePresets.conqueror },
  Nami: { role: "Support", core: ["Dream Maker", "Imperial Mandate", "Moonstone Renewer"], runes: runePresets.aery },
  Nasus: { role: "Top", core: ["Trinity Force", "Frozen Heart", "Spirit Visage"], runes: runePresets.grasp },
  Nautilus: { role: "Support", core: ["Celestial Opposition", "Locket of the Iron Solari", "Zeke's Convergence"], runes: runePresets.aftershock },
  Nidalee: { role: "Jungle", core: ["Lich Bane", "Shadowflame", "Zhonya's Hourglass"], runes: runePresets.darkHarvest },
  Nilah: { role: "ADC", core: ["The Collector", "Infinity Edge", "Immortal Shieldbow"], runes: runePresets.conqueror },
  Nocturne: { role: "Jungle", core: ["Stridebreaker", "Spear of Shojin", "Sterak's Gage"], runes: runePresets.lethalTempo },
  Olaf: { role: "Top", core: ["Stridebreaker", "Sterak's Gage", "Death's Dance"], runes: runePresets.conqueror },
  Orianna: { role: "Mid", core: ["Luden's Echo", "Horizon Focus", "Rabadon's Deathcap"], runes: runePresets.aery },
  Ornn: { role: "Top", core: ["Sunfire Aegis", "Kaenic Rookern", "Jak'Sho, The Protean"], runes: runePresets.grasp },
  Pantheon: { role: "Support", core: ["Bloodsong", "Youmuu's Ghostblade", "Black Cleaver"], runes: runePresets.pta },
  Pyke: { role: "Support", core: ["Bloodsong", "Umbral Glaive", "Youmuu's Ghostblade"], runes: runePresets.hail },
  Qiyana: { role: "Mid", core: ["Youmuu's Ghostblade", "Opportunity", "Serylda's Grudge"], runes: runePresets.electrocute },
  Rakan: { role: "Support", core: ["Dream Maker", "Redemption", "Locket of the Iron Solari"], runes: runePresets.guardian },
  Rammus: { role: "Jungle", core: ["Thornmail", "Sunfire Aegis", "Jak'Sho, The Protean"], runes: runePresets.aftershock },
  Renekton: { role: "Top", core: ["Eclipse", "Black Cleaver", "Sterak's Gage"], runes: runePresets.pta },
  Rengar: { role: "Jungle", core: ["Youmuu's Ghostblade", "The Collector", "Infinity Edge"], runes: runePresets.electrocute },
  Riven: { role: "Top", core: ["Eclipse", "Sundered Sky", "Black Cleaver"], runes: runePresets.conqueror },
  Rumble: { role: "Top", core: ["Liandry's Torment", "Riftmaker", "Zhonya's Hourglass"], runes: runePresets.comet },
  Samira: { role: "ADC", core: ["The Collector", "Infinity Edge", "Immortal Shieldbow"], runes: runePresets.conqueror },
  Sejuani: { role: "Jungle", core: ["Sunfire Aegis", "Warmog's Armor", "Jak'Sho, The Protean"], runes: runePresets.aftershock },
  Senna: { role: "Support", core: ["Bloodsong", "Youmuu's Ghostblade", "Rapid Firecannon"], runes: runePresets.fleet },
  Seraphine: { role: "Support", core: ["Dream Maker", "Moonstone Renewer", "Staff of Flowing Water"], runes: runePresets.aery },
  Sett: { role: "Top", core: ["Stridebreaker", "Sterak's Gage", "Overlord's Bloodmail"], runes: runePresets.conqueror },
  Shaco: { role: "Jungle", core: ["Youmuu's Ghostblade", "The Collector", "Infinity Edge"], runes: runePresets.hail },
  Shen: { role: "Top", core: ["Heartsteel", "Titanic Hydra", "Sunfire Aegis"], runes: runePresets.grasp },
  Singed: { role: "Top", core: ["Rylai's Crystal Scepter", "Liandry's Torment", "Riftmaker"], runes: runePresets.conqueror },
  Sion: { role: "Top", core: ["Heartsteel", "Sunfire Aegis", "Titanic Hydra"], runes: runePresets.grasp },
  Sivir: { role: "ADC", core: ["Essence Reaver", "Navori Flickerblade", "Infinity Edge"], runes: runePresets.lethalTempo },
  Skarner: { role: "Jungle", core: ["Heartsteel", "Sunfire Aegis", "Jak'Sho, The Protean"], runes: runePresets.aftershock },
  Smolder: { role: "ADC", core: ["Trinity Force", "Manamune", "Rapid Firecannon"], runes: runePresets.fleet },
  Sona: { role: "Support", core: ["Dream Maker", "Moonstone Renewer", "Staff of Flowing Water"], runes: runePresets.aery },
  Soraka: { role: "Support", core: ["Dream Maker", "Moonstone Renewer", "Redemption"], runes: runePresets.aery },
  Swain: { role: "Support", core: ["Rylai's Crystal Scepter", "Liandry's Torment", "Zhonya's Hourglass"], runes: runePresets.conqueror },
  Sylas: { role: "Mid", core: ["Luden's Echo", "Stormsurge", "Zhonya's Hourglass"], runes: runePresets.electrocute },
  Syndra: { role: "Mid", core: ["Luden's Echo", "Shadowflame", "Rabadon's Deathcap"], runes: runePresets.firstStrike },
  TahmKench: { role: "Top", core: ["Heartsteel", "Sunfire Aegis", "Spirit Visage"], runes: runePresets.grasp },
  Taliyah: { role: "Jungle", core: ["Blackfire Torch", "Liandry's Torment", "Zhonya's Hourglass"], runes: runePresets.darkHarvest },
  Talon: { role: "Mid", core: ["Youmuu's Ghostblade", "Opportunity", "Serylda's Grudge"], runes: runePresets.electrocute },
  Taric: { role: "Support", core: ["Celestial Opposition", "Locket of the Iron Solari", "Redemption"], runes: runePresets.guardian },
  Thresh: { role: "Support", core: ["Celestial Opposition", "Locket of the Iron Solari", "Knight's Vow"], runes: runePresets.aftershock },
  Tristana: { role: "ADC", core: ["Kraken Slayer", "Infinity Edge", "Navori Flickerblade"], runes: runePresets.pta },
  Trundle: { role: "Jungle", core: ["Trinity Force", "Titanic Hydra", "Sterak's Gage"], runes: runePresets.lethalTempo },
  Tryndamere: { role: "Top", core: ["Kraken Slayer", "Navori Flickerblade", "Infinity Edge"], runes: runePresets.lethalTempo },
  TwistedFate: { role: "Mid", core: ["Rod of Ages", "Lich Bane", "Rapid Firecannon"], runes: runePresets.fleet },
  Twitch: { role: "ADC", core: ["Blade of The Ruined King", "Runaan's Hurricane", "Infinity Edge"], runes: runePresets.pta },
  Udyr: { role: "Jungle", core: ["Liandry's Torment", "Dead Man's Plate", "Spirit Visage"], runes: runePresets.conqueror },
  Urgot: { role: "Top", core: ["Black Cleaver", "Hullbreaker", "Sterak's Gage"], runes: runePresets.pta },
  Varus: { role: "ADC", core: ["Youmuu's Ghostblade", "Opportunity", "Serylda's Grudge"], runes: runePresets.comet },
  Vayne: { role: "ADC", core: ["Blade of The Ruined King", "Guinsoo's Rageblade", "Terminus"], runes: runePresets.lethalTempo },
  Veigar: { role: "Mid", core: ["Rod of Ages", "Rabadon's Deathcap", "Void Staff"], runes: runePresets.comet },
  Vex: { role: "Mid", core: ["Luden's Echo", "Shadowflame", "Zhonya's Hourglass"], runes: runePresets.electrocute },
  Vi: { role: "Jungle", core: ["Sundered Sky", "Black Cleaver", "Sterak's Gage"], runes: runePresets.conqueror },
  Viego: { role: "Jungle", core: ["Blade of The Ruined King", "Sundered Sky", "Sterak's Gage"], runes: runePresets.conqueror },
  Viktor: { role: "Mid", core: ["Luden's Echo", "Lich Bane", "Rabadon's Deathcap"], runes: runePresets.aery },
  Vladimir: { role: "Mid", core: ["Cosmic Drive", "Rabadon's Deathcap", "Void Staff"], runes: runePresets.phaseRush },
  Volibear: { role: "Top", core: ["Rod of Ages", "Navori Flickerblade", "Spirit Visage"], runes: runePresets.grasp },
  Warwick: { role: "Jungle", core: ["Titanic Hydra", "Blade of The Ruined King", "Spirit Visage"], runes: runePresets.lethalTempo },
  Wukong: { role: "Jungle", core: ["Sundered Sky", "Black Cleaver", "Sterak's Gage"], runes: runePresets.conqueror },
  Xayah: { role: "ADC", core: ["Essence Reaver", "Navori Flickerblade", "Infinity Edge"], runes: runePresets.lethalTempo },
  Xerath: { role: "Support", core: ["Luden's Echo", "Horizon Focus", "Rabadon's Deathcap"], runes: runePresets.comet },
  XinZhao: { role: "Jungle", core: ["Sundered Sky", "Black Cleaver", "Sterak's Gage"], runes: runePresets.conqueror },
  Yasuo: { role: "Mid", core: ["Blade of The Ruined King", "Infinity Edge", "Immortal Shieldbow"], runes: runePresets.lethalTempo },
  Yone: { role: "Mid", core: ["Blade of The Ruined King", "Infinity Edge", "Immortal Shieldbow"], runes: runePresets.lethalTempo },
  Yorick: { role: "Top", core: ["Trinity Force", "Hullbreaker", "Serylda's Grudge"], runes: runePresets.grasp },
  Yuumi: { role: "Support", core: ["Dream Maker", "Moonstone Renewer", "Ardent Censer"], runes: runePresets.aery },
  Zac: { role: "Jungle", core: ["Sunfire Aegis", "Spirit Visage", "Unending Despair"], runes: runePresets.aftershock },
  Zed: { role: "Mid", core: ["Youmuu's Ghostblade", "Opportunity", "Serylda's Grudge"], runes: runePresets.electrocute },
  Zeri: { role: "ADC", core: ["Statikk Shiv", "Runaan's Hurricane", "Infinity Edge"], runes: runePresets.lethalTempo },
  Ziggs: { role: "ADC", core: ["Blackfire Torch", "Liandry's Torment", "Rabadon's Deathcap"], runes: runePresets.comet },
  Zilean: { role: "Support", core: ["Dream Maker", "Shurelya's Battlesong", "Redemption"], runes: runePresets.aery },
  Zoe: { role: "Mid", core: ["Luden's Echo", "Horizon Focus", "Rabadon's Deathcap"], runes: runePresets.electrocute },
  Zyra: { role: "Support", core: ["Zaz'Zak's Realmspike", "Liandry's Torment", "Rylai's Crystal Scepter"], runes: runePresets.comet }
};

export const buildArchetypes: BuildArchetype[] = [
  {
    id: "meta",
    label: "Meta padrao",
    shortLabel: "Meta",
    description: "Escolha mais segura para a identidade principal do campeao.",
    tags: ["Damage", "Health", "Cooldown", "SpellDamage", "AttackSpeed", "CriticalStrike"],
    preferredItems: [],
    runePreset: {
      primary: "Adaptativo",
      keystone: "Melhor runa por classe",
      secondary: "Flex",
      shards: "Ajuste por matchup"
    }
  },
  {
    id: "critico",
    label: "Critico / DPS",
    shortLabel: "Critico",
    description: "Para carregar lutas longas com DPS e chance critica.",
    tags: ["Damage", "CriticalStrike", "AttackSpeed", "ArmorPenetration", "LifeSteal"],
    preferredItems: ["Infinity Edge", "Kraken Slayer", "Yun Tal Wildarrows", "Runaan's Hurricane", "Lord Dominik's Regards", "Bloodthirster"],
    runePreset: {
      primary: "Precision",
      keystone: "Press the Attack",
      secondary: "Sorcery",
      shards: "Attack Speed, Adaptive, Health"
    }
  },
  {
    id: "letalidade",
    label: "Letalidade / Pickoff",
    shortLabel: "Letalidade",
    description: "Para explodir alvos frageis, jogar por flanco e snowball.",
    tags: ["Damage", "ArmorPenetration", "Cooldown", "NonbootsMovement"],
    preferredItems: ["Youmuu's Ghostblade", "Voltaic Cyclosword", "Opportunity", "Hubris", "Serylda's Grudge", "Edge of Night"],
    runePreset: {
      primary: "Domination",
      keystone: "Electrocute",
      secondary: "Precision",
      shards: "Adaptive, Adaptive, Health"
    }
  },
  {
    id: "ap-burst",
    label: "AP / Burst",
    shortLabel: "AP Burst",
    description: "Para poke, dano magico e janelas fortes de ultimate.",
    tags: ["SpellDamage", "MagicPenetration", "Mana", "Cooldown"],
    preferredItems: ["Luden's Echo", "Blackfire Torch", "Shadowflame", "Rabadon's Deathcap", "Void Staff", "Zhonya's Hourglass"],
    runePreset: {
      primary: "Sorcery",
      keystone: "Arcane Comet",
      secondary: "Inspiration",
      shards: "Ability Haste, Adaptive, Health"
    }
  },
  {
    id: "on-hit",
    label: "On-hit / Velocidade",
    shortLabel: "On-hit",
    description: "Para campeoes que abusam de ataque rapido e efeitos ao contato.",
    tags: ["AttackSpeed", "OnHit", "Damage", "LifeSteal", "SpellBlock"],
    preferredItems: ["Guinsoo's Rageblade", "Blade of The Ruined King", "Terminus", "Wit's End", "Kraken Slayer", "Runaan's Hurricane"],
    runePreset: {
      primary: "Precision",
      keystone: "Lethal Tempo",
      secondary: "Resolve",
      shards: "Attack Speed, Adaptive, Health"
    }
  },
  {
    id: "bruiser",
    label: "Bruiser / Lutador",
    shortLabel: "Bruiser",
    description: "Para trocar por tempo, sobreviver e pressionar side lane.",
    tags: ["Damage", "Health", "Cooldown", "LifeSteal", "Armor", "SpellBlock"],
    preferredItems: ["Black Cleaver", "Sundered Sky", "Sterak's Gage", "Death's Dance", "Maw of Malmortius", "Spirit Visage"],
    runePreset: {
      primary: "Precision",
      keystone: "Conqueror",
      secondary: "Resolve",
      shards: "Attack Speed, Adaptive, Health"
    }
  },
  {
    id: "tank",
    label: "Tank / Frontline",
    shortLabel: "Tank",
    description: "Para iniciar, absorver cooldowns e proteger carregadores.",
    tags: ["Health", "Armor", "SpellBlock", "Tenacity", "HealthRegen", "Slow"],
    preferredItems: ["Heartsteel", "Sunfire Aegis", "Jak'Sho, The Protean", "Thornmail", "Kaenic Rookern", "Randuin's Omen"],
    runePreset: {
      primary: "Resolve",
      keystone: "Aftershock",
      secondary: "Inspiration",
      shards: "Ability Haste, Armor/MR, Health"
    }
  },
  {
    id: "suporte",
    label: "Suporte / Utilidade",
    shortLabel: "Suporte",
    description: "Para peel, cura, escudo, engage e utilidade para o time.",
    tags: ["Aura", "Active", "Cooldown", "ManaRegen", "HealthRegen", "Slow"],
    preferredItems: ["Locket of the Iron Solari", "Redemption", "Knight's Vow", "Moonstone Renewer", "Trailblazer", "Zeke's Convergence"],
    runePreset: {
      primary: "Resolve",
      keystone: "Guardian",
      secondary: "Inspiration",
      shards: "Ability Haste, Armor/MR, Health"
    }
  }
];

export function ddragonVersion() {
  return process.env.NEXT_PUBLIC_DDRAGON_VERSION || "16.13.1";
}

export function championImageUrl(championId: string, version = ddragonVersion()) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championId}.png`;
}

export function itemImageUrl(itemId: string, version = ddragonVersion()) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
}

export async function loadDDragonData(version = ddragonVersion()): Promise<DDragonData> {
  const [championResponse, itemResponse] = await Promise.all([
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/champion.json`),
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`)
  ]);

  if (!championResponse.ok || !itemResponse.ok) {
    throw new Error("Nao foi possivel carregar os dados oficiais do Data Dragon.");
  }

  const championJson = (await championResponse.json()) as DDragonChampionResponse;
  const itemJson = (await itemResponse.json()) as DDragonItemResponse;

  return {
    champions: Object.values(championJson.data)
      .map((champion, index) => ({
        id: champion.id,
        name: champion.name,
        title: champion.title,
        roles: inferRoles(champion.tags),
        tags: champion.tags,
        accent: accents[index % accents.length]
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    items: Object.entries(itemJson.data)
      .map(([id, item]) => ({
        id,
        name: item.name,
        plaintext: item.plaintext ?? "",
        tags: item.tags ?? [],
        stats: item.stats ?? {},
        total: item.gold?.total ?? 0,
        maps: item.maps ?? {},
        consumed: item.consumed ?? false,
        inStore: item.inStore !== false && item.gold?.purchasable !== false,
        depth: item.depth,
        into: item.into,
        from: item.from
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
  };
}

export async function loadChampionAbilityDetails(championId: string, version = ddragonVersion()): Promise<ChampionAbilityDetails> {
  const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/champion/${championId}.json`);

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar as habilidades do campeao.");
  }

  const json = (await response.json()) as DDragonChampionDetailResponse;
  const champion = json.data[championId];
  const keys = ["Q", "W", "E", "R"] as const;

  return {
    championId,
    passive: {
      key: "P",
      name: champion.passive.name,
      description: cleanDDragonText(champion.passive.description)
    },
    abilities: champion.spells.map((spell, index) => ({
      key: keys[index],
      name: spell.name,
      description: cleanDDragonText(spell.tooltip || spell.description)
    }))
  };
}

export function getModeItems(items: CatalogItem[], mode: GameMode) {
  const mapId = modes.find((item) => item.id === mode)?.mapId ?? "11";

  return items.filter((item) => {
    const availableOnMap = item.maps[mapId] === true;
    return availableOnMap && item.total > 0 && item.inStore;
  });
}

export function getBuildsFor(champion: Champion, allItems: CatalogItem[], mode: GameMode, archetypeId: BuildArchetypeId = "meta", allChampions: Champion[] = []): Build[] {
  const modeItems = getModeItems(allItems, mode);
  const primaryTag = getPrimaryTag(champion);
  const archetype = buildArchetypes.find((a) => a.id === archetypeId) ?? buildArchetypes[0];
  const metaProfile = getChampionMetaProfile(champion, mode, archetype.id);
  const role = metaProfile.role;
  const scored = modeItems
    .filter((item) => isCompletedItem(item))
    .map((item) => ({ item, score: scoreItem(item, primaryTag, mode, archetype, metaProfile) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const boots = pickNamedItem(modeItems, metaProfile.boots) ?? pickBoot(modeItems, primaryTag);
  const starters = pickNamedItems(modeItems, metaProfile.starting, 2);

  // Antes disso, o core vinha sempre de metaProfile.core, ignorando o arquetipo escolhido na aba.
  // Resultado: trocar de "Meta" pra "Critico" ou "Letalidade" nao mudava um unico item.
  // Agora, quando o arquetipo nao e "meta", a gente tenta montar o core a partir da lista
  // preferida daquele arquetipo primeiro, e so cai no perfil padrao se nao achar itens suficientes
  // disponiveis nesse modo de jogo.
  const archetypeCoreSeed = archetype.id !== "meta" ? pickNamedItems(modeItems, archetype.preferredItems, 3) : [];
  const rankedCore = archetypeCoreSeed.length >= 2 ? archetypeCoreSeed : pickNamedItems(modeItems, metaProfile.core, 3);
  const core = fillItems(rankedCore, scored.map(({ item }) => item), boots ? [boots.id] : [], 3);

  const situationalPool = archetype.id !== "meta"
    ? Array.from(new Set([...archetype.preferredItems, ...metaProfile.situational]))
    : metaProfile.situational;
  const situationalSeeds = pickNamedItems(modeItems, situationalPool, 5);
  const situational = fillItems(situationalSeeds, scored.map(({ item }) => item), [...core.map((item) => item.id), boots?.id ?? ""], 5);
  const modeText = modeCopy(mode);

  return [
    {
      id: `${champion.id}-${mode}-${primaryTag}-${archetype.id}`,
      champion: champion.id,
      archetype,
      title: `${modeText.title} para ${champion.name}`,
      mode,
      role,
      style: metaProfile.style,
      difficulty: metaProfile.difficulty ?? difficultyByTag(primaryTag),
      confidence: confidenceByMode(mode, scored.length, metaProfile.confidence),
      patchNote: `Patch ${ddragonVersion()}. ${metaProfile.source}`,
      summary: `${modeText.summary} ${metaProfile.notes}`,
      starting: starters.length > 0 ? starters : pickStarters(modeItems, primaryTag, mode),
      core,
      situational,
      boots,
      runes: archetype.id !== "meta" ? archetype.runePreset : metaProfile.runes,
      spells: metaProfile.spells ?? spellsByRole(role, mode),
      powerSpikes: powerSpikesByMode(mode, core),
      playPattern: playPatternByTag(primaryTag, mode),
      avoid: avoidByMode(mode),
      skillOrder: metaProfile.skillOrder ?? generateSkillOrder(primaryTag, archetype.id),
      strongAgainst: generateMatchups(champion, allChampions, role, true),
      weakAgainst: generateMatchups(champion, allChampions, role, false)
    }
  ];
}

function getChampionMetaProfile(champion: Champion, mode: GameMode, archetypeId: BuildArchetypeId): ChampionMetaProfile {
  const primaryTag = getPrimaryTag(champion);
  const fallback = fallbackMetaByTag(primaryTag, champion.roles[0] ?? "Mid");
  const override = championMetaOverrides[champion.id];
  const profile = { ...fallback, ...override };

  if (mode === "aram") {
    return {
      ...profile,
      role: champion.roles[0] ?? profile.role,
      confidence: Math.max(76, profile.confidence - 5),
      source: `${metaSource} Ajustado para ARAM.`,
      starting: aramStarters(primaryTag),
      boots: profile.boots,
      situational: [...profile.situational, "Warmog's Armor", "Axiom Arc", "Banshee's Veil"],
      notes: "Plano ajustado para lutas constantes: sustain, poke e itens que entregam valor sem precisar de reset em base."
    };
  }
  if (mode === "aram-chaos") {
    return {
      ...profile,
      role: champion.roles[0] ?? profile.role,
      confidence: Math.max(70, profile.confidence - 8),
      source: `${metaSource} Ajustado para ARAM Desordem.`,
      starting: aramStarters(primaryTag),
      boots: profile.boots,
      situational: [...profile.situational, "Warmog's Armor", "Axiom Arc", "Banshee's Veil", "Mortal Reminder"],
      notes: "Build caótico: prioriza itens baratos, sustain e redução de cura para enfrentar composições de alta cura."
    };
  }

  if (mode === "arena") {
    return {
      ...profile,
      confidence: Math.max(72, profile.confidence - 8),
      source: `${metaSource} Ajustado para Arena.`,
      starting: [],
      situational: [...profile.situational, "Guardian Angel", "Jak'Sho, The Protean", "Riftmaker"],
      notes: "Plano adaptado para duelo: prioriza primeiro spike, sobrevivencia e dano consistente em rounds curtos."
    };
  }

  if (archetypeId !== "meta") {
    return {
      ...profile,
      confidence: Math.max(70, profile.confidence - 6),
      source: `${metaSource} Estilo selecionado prioriza itens desse arquetipo no core e nos situacionais.`,
      notes: "O core agora tenta usar os itens tipicos do estilo escolhido primeiro, caindo pro consenso padrao so quando faltar opcao no modo atual."
    };
  }

  return {
    ...profile,
    source: metaSource,
    notes: "Core e runas saem de um perfil por campeao/rota, com fallback por classe quando os agregadores divergem."
  };
}

function fallbackMetaByTag(tag: string, role: ChampionRole): ChampionMetaProfile {
  if (role === "Support" || tag === "Support") {
    return {
      role: "Support",
      style: "Utility",
      confidence: 78,
      source: metaSource,
      starting: ["World Atlas", "Health Potion"],
      boots: ["Ionian Boots of Lucidity", "Boots of Swiftness"],
      core: ["Celestial Opposition", "Locket of the Iron Solari", "Redemption"],
      situational: ["Knight's Vow", "Zeke's Convergence", "Mikael's Blessing", "Trailblazer", "Moonstone Renewer"],
      runes: runePresets.guardian,
      notes: "Fallback de suporte focado em peel, engage e utilidade."
    };
  }

  if (tag === "Marksman") {
    return {
      role: "ADC",
      style: "Critical",
      confidence: 80,
      source: metaSource,
      starting: ["Doran's Blade", "Health Potion"],
      boots: ["Berserker's Greaves", "Plated Steelcaps"],
      core: ["Kraken Slayer", "Infinity Edge", "Lord Dominik's Regards"],
      situational: ["Bloodthirster", "Guardian Angel", "Mercurial Scimitar", "Runaan's Hurricane", "Rapid Firecannon"],
      runes: runePresets.pta,
      notes: "Fallback de atirador focado em DPS, critico e terceiro item contra frontline."
    };
  }

  if (tag === "Mage") {
    return {
      role,
      style: "Burst",
      confidence: 78,
      source: metaSource,
      starting: ["Doran's Ring", "Health Potion"],
      boots: ["Sorcerer's Shoes", "Ionian Boots of Lucidity"],
      core: ["Luden's Echo", "Shadowflame", "Rabadon's Deathcap"],
      situational: ["Zhonya's Hourglass", "Void Staff", "Banshee's Veil", "Liandry's Torment", "Horizon Focus"],
      runes: runePresets.comet,
      notes: "Fallback de mago focado em mana, burst e penetracao magica."
    };
  }

  if (tag === "Assassin") {
    return {
      role,
      style: "Lethality",
      confidence: 77,
      source: metaSource,
      starting: ["Long Sword", "Refillable Potion"],
      boots: ["Ionian Boots of Lucidity", "Mercury's Treads"],
      core: ["Youmuu's Ghostblade", "Opportunity", "Serylda's Grudge"],
      situational: ["Edge of Night", "The Collector", "Serpent's Fang", "Maw of Malmortius", "Guardian Angel"],
      runes: runePresets.electrocute,
      notes: "Fallback de assassino focado em snowball, pickoff e flancos."
    };
  }

  if (tag === "Tank") {
    return {
      role,
      style: "Utility",
      confidence: 78,
      source: metaSource,
      starting: ["Doran's Shield", "Health Potion"],
      boots: ["Plated Steelcaps", "Mercury's Treads"],
      core: ["Sunfire Aegis", "Kaenic Rookern", "Jak'Sho, The Protean"],
      situational: ["Thornmail", "Frozen Heart", "Randuin's Omen", "Unending Despair", "Spirit Visage"],
      runes: runePresets.grasp,
      notes: "Fallback de tanque focado em frontline e compra por tipo de dano inimigo."
    };
  }

  return {
    role,
    style: "Meta",
    confidence: 78,
    source: metaSource,
    starting: ["Doran's Blade", "Health Potion"],
    boots: ["Plated Steelcaps", "Mercury's Treads"],
    core: ["Sundered Sky", "Black Cleaver", "Sterak's Gage"],
    situational: ["Death's Dance", "Maw of Malmortius", "Spirit Visage", "Guardian Angel", "Spear of Shojin"],
    runes: runePresets.conqueror,
    notes: "Fallback de lutador focado em troca longa, vida e dano consistente."
  };
}

function aramStarters(tag: string) {
  if (tag === "Mage" || tag === "Support") return ["Guardian's Orb", "Health Potion"];
  if (tag === "Marksman") return ["Guardian's Hammer", "Health Potion"];
  return ["Guardian's Blade", "Health Potion"];
}

function generateSkillOrder(tag: string, archetypeId: BuildArchetypeId): string[] {
  if (archetypeId === "suporte" || tag === "Support") return ["Q", "E", "W", "Q", "Q", "R", "Q", "E", "E", "E", "R", "W", "W", "W", "W"];
  if (archetypeId === "ap-burst" || tag === "Mage") return ["Q", "E", "W", "Q", "Q", "R", "Q", "Q", "E", "E", "R", "E", "E", "W", "W"];
  if (tag === "Marksman") return ["Q", "W", "E", "Q", "Q", "R", "Q", "Q", "W", "W", "R", "W", "W", "E", "E"];
  if (archetypeId === "tank" || tag === "Tank") return ["W", "Q", "E", "W", "W", "R", "W", "W", "Q", "Q", "R", "Q", "Q", "E", "E"];
  return ["Q", "E", "W", "Q", "Q", "R", "Q", "Q", "E", "E", "R", "E", "E", "W", "W"];
}

// IMPORTANTE: nao existe fonte de estatisticas de partidas reais conectada (tipo op.gg/u.gg).
// Este gerador cria uma estimativa heuristica e DETERMINISTICA (mesmo campeao sempre da o mesmo
// resultado) restrita a campeoes que jogam a mesma rota, pra pelo menos ser plausivel.
// A UI deixa isso explicito ("estimativa") em vez de fingir que e dado real.
function hashOf(text: string) {
  return text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function generateMatchups(champion: Champion, allChampions: Champion[], role: ChampionRole, isStrong: boolean): Matchup[] {
  const hash = hashOf(champion.id);

  const sameRole = allChampions.filter((c) => c.id !== champion.id && c.roles.includes(role));
  const pool = sameRole.length >= 6 ? sameRole : allChampions.filter((c) => c.id !== champion.id);

  const sorted = [...pool].sort((a, b) => {
    const scoreA = (hash * hashOf(a.id)) % 97;
    const scoreB = (hash * hashOf(b.id)) % 97;
    return scoreA - scoreB;
  });

  const offset = isStrong ? 0 : Math.floor(sorted.length / 2);
  const matchups: Matchup[] = [];

  for (let i = 0; i < 5 && sorted.length > 0; i++) {
    const opp = sorted[(offset + i) % sorted.length];
    const jitter = ((hash + i * 17) % 40) / 10;
    const baseWinRate = isStrong ? 52 + (hash % 8) + jitter : 42 + (hash % 5) + jitter;
    matchups.push({
      championId: opp.id,
      championName: opp.name,
      winRate: Number(baseWinRate.toFixed(2)),
      games: 1000 + ((hash * 7) % 5000) + i * 342
    });
  }

  return matchups.sort((a, b) => (isStrong ? b.winRate - a.winRate : a.winRate - b.winRate));
}

function inferRoles(tags: string[]): ChampionRole[] {
  const roles = tags.flatMap((tag) => roleByTag[tag] ?? []);
  const deduped = rolePriority.filter((role) => roles.includes(role));
  return deduped.length > 0 ? deduped : ["Mid"];
}

function getPrimaryTag(champion: Champion) {
  return champion.tags[0] ?? "Fighter";
}

function isCompletedItem(item: CatalogItem) {
  const isBoot = bootNames.has(item.name) || item.tags.includes("Boots");
  const isConsumable = item.consumed || item.tags.includes("Consumable") || item.tags.includes("Trinket");
  const isStarter = starterNames.has(item.name);

  return !isBoot && !isConsumable && !isStarter && item.total >= 1600 && (!item.into || item.into.length === 0);
}

function pickBoot(items: CatalogItem[], tag: string) {
  const preferred =
    tag === "Marksman"
      ? "Berserker's Greaves"
      : tag === "Mage"
        ? "Sorcerer's Shoes"
        : tag === "Assassin"
          ? "Ionian Boots of Lucidity"
          : tag === "Support"
            ? "Ionian Boots of Lucidity"
            : "Plated Steelcaps";

  return items.find((item) => item.name === preferred) ?? items.find((item) => bootNames.has(item.name) || item.tags.includes("Boots"));
}

function pickStarters(items: CatalogItem[], tag: string, mode: GameMode) {
  const aramNames =
    tag === "Mage" || tag === "Support"
      ? ["Guardian's Orb", "Health Potion"]
      : tag === "Marksman"
        ? ["Guardian's Hammer", "Health Potion"]
        : ["Guardian's Blade", "Health Potion"];
  const defaultNames =
    tag === "Mage"
      ? ["Doran's Ring", "Health Potion"]
      : tag === "Tank"
        ? ["Doran's Shield", "Health Potion"]
        : tag === "Support"
          ? ["World Atlas", "Health Potion"]
          : ["Doran's Blade", "Health Potion"];
  const names = mode === "aram" ? aramNames : defaultNames;
  const picked = names.map((name) => items.find((item) => item.name === name)).filter(Boolean) as CatalogItem[];

  if (picked.length > 0) {
    return picked;
  }

  return items.filter((item) => starterNames.has(item.name)).slice(0, 2);
}

function pickNamedItems(items: CatalogItem[], names: string[], limit: number) {
  const picked: CatalogItem[] = [];
  const seen = new Set<string>();

  for (const name of names) {
    const item = pickNamedItem(items, [name]);
    if (item && !seen.has(item.id)) {
      picked.push(item);
      seen.add(item.id);
    }

    if (picked.length >= limit) break;
  }

  return picked;
}

function pickNamedItem(items: CatalogItem[], names: string[]) {
  for (const name of names) {
    const normalizedName = normalizeItemName(name);
    const exact = items.find((item) => normalizeItemName(item.name) === normalizedName);
    if (exact) return exact;

    const partial = items.find((item) => normalizeItemName(item.name).includes(normalizedName));
    if (partial) return partial;
  }

  return undefined;
}

function fillItems(seed: CatalogItem[], candidates: CatalogItem[], blockedIds: string[], limit: number) {
  const blocked = new Set(blockedIds.filter(Boolean));
  const seen = new Set<string>();
  const result: CatalogItem[] = [];

  for (const item of seed) {
    if (!blocked.has(item.id) && !seen.has(item.id)) {
      result.push(item);
      seen.add(item.id);
    }
  }

  for (const item of candidates) {
    if (result.length >= limit) break;
    if (blocked.has(item.id) || seen.has(item.id)) continue;
    result.push(item);
    seen.add(item.id);
  }

  return result.slice(0, limit);
}

function normalizeItemName(name: string) {
  return name
    .toLowerCase()
    .replace(/['.]/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanDDragonText(text: string) {
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreItem(item: CatalogItem, tag: string, mode: GameMode, archetype: BuildArchetype, profile: ChampionMetaProfile) {
  let score = curatedBoosts[tag]?.[item.name] ?? 0;
  const tags = new Set(item.tags);
  const stats = item.stats;

  if (profile.core.some((name) => normalizeItemName(name) === normalizeItemName(item.name))) {
    score += 80;
  }

  if (profile.situational.some((name) => normalizeItemName(name) === normalizeItemName(item.name))) {
    score += 28;
  }

  if (archetype.id !== "meta") {
    score += hasAny(tags, archetype.tags) * 8;
    if (archetype.preferredItems.includes(item.name)) {
      score += 30; // Grande boost para itens do arquetipo
    }
  } else {
    if (tag === "Marksman") {
      score += hasAny(tags, ["Damage", "CriticalStrike", "AttackSpeed", "LifeSteal", "ArmorPenetration"]) * 7;
      score += numeric(stats, ["FlatPhysicalDamageMod", "PercentAttackSpeedMod", "FlatCritChanceMod"]) * 0.6;
    }

    if (tag === "Mage") {
      score += hasAny(tags, ["SpellDamage", "Mana", "Cooldown", "MagicPenetration"]) * 8;
      score += numeric(stats, ["FlatMagicDamageMod", "FlatMPPoolMod"]) * 0.08;
    }

    if (tag === "Assassin") {
      score += hasAny(tags, ["Damage", "ArmorPenetration", "Cooldown", "NonbootsMovement"]) * 8;
      score += numeric(stats, ["FlatPhysicalDamageMod", "FlatArmorPenetrationMod"]) * 0.7;
    }

    if (tag === "Fighter") {
      score += hasAny(tags, ["Damage", "Health", "Cooldown", "LifeSteal", "Armor"]) * 7;
      score += numeric(stats, ["FlatPhysicalDamageMod", "FlatHPPoolMod"]) * 0.12;
    }

    if (tag === "Tank") {
      score += hasAny(tags, ["Health", "Armor", "SpellBlock", "Tenacity", "HealthRegen"]) * 8;
      score += numeric(stats, ["FlatHPPoolMod", "FlatArmorMod", "FlatSpellBlockMod"]) * 0.12;
    }

    if (tag === "Support") {
      score += hasAny(tags, ["Aura", "Active", "Cooldown", "ManaRegen", "HealthRegen", "Slow"]) * 8;
      score += item.name.includes("Vow") || item.name.includes("Redemption") || item.name.includes("Locket") ? 10 : 0;
    }
  }

  if (mode === "aram") {
    score += hasAny(tags, ["Health", "HealthRegen", "ManaRegen", "Cooldown", "SpellDamage"]) * 3;
  }

  if (mode === "aram-chaos") {
    score += hasAny(tags, ["Health", "HealthRegen", "ManaRegen", "Cooldown", "SpellDamage", "ArmorPenetration"]) * 4;
  }

  if (mode === "arena") {
    score += hasAny(tags, ["Health", "LifeSteal", "SpellVamp", "Armor", "SpellBlock", "Tenacity"]) * 5;
  }

  if (mode === "casual") {
    score += item.total < 3400 ? 2 : 0;
  }

  return score;
}

function hasAny(tags: Set<string>, wanted: string[]) {
  return wanted.reduce((total, tag) => total + (tags.has(tag) ? 1 : 0), 0);
}

function numeric(stats: Record<string, number>, keys: string[]) {
  return keys.reduce((total, key) => total + Math.max(0, stats[key] ?? 0), 0);
}

function uniqueItems(items: CatalogItem[], blockedIds: string[]) {
  const blocked = new Set(blockedIds);
  const seen = new Set<string>();

  return items.filter((item) => {
    if (blocked.has(item.id) || seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function styleByTag(tag: string, mode: GameMode): Build["style"] {
  if (mode === "arena") return "Duel";
  if (tag === "Mage" || tag === "Assassin") return "Burst";
  if (tag === "Marksman") return "Scaling";
  if (tag === "Support" || tag === "Tank") return "Utility";
  return "Meta";
}

function difficultyByTag(tag: string): Build["difficulty"] {
  if (tag === "Assassin") return "Hard";
  if (tag === "Mage" || tag === "Marksman") return "Medium";
  return "Easy";
}

function confidenceByMode(mode: GameMode, optionCount: number, profileConfidence = 78) {
  const base = mode === "ranked" ? 84 : mode === "aram" ? 80 : mode === "arena" ? 76 : 72;
  return Math.min(94, Math.max(62, Math.round((base + profileConfidence) / 2) + Math.min(6, Math.floor(optionCount / 22))));
}

function modeCopy(mode: GameMode) {
  if (mode === "ranked") {
    return { label: "Ranked", title: "Meta consistente", summary: "Plano para reduzir variancia, comprar spikes confiaveis e jogar por objetivos." };
  }

  if (mode === "aram") {
    return { label: "ARAM", title: "Build de luta constante", summary: "Plano para teamfights frequentes, poke, sustain e spikes baratos." };
  }

  if (mode === "arena") {
    return { label: "Arena", title: "Build de duelo", summary: "Plano para sobreviver ao burst, vencer 2v2 e abusar de itens exclusivos do modo." };
  }

  if (mode === "aram-chaos") {
    return { label: "ARAM Desordem", title: "Build caótico de ARAM", summary: "Plano para compras rápidas, sustain e mitigação de cura." };
  }

  return { label: "Normal Game", title: "Build flexivel", summary: "Plano para testar limites do campeao sem fugir da identidade principal." };
}

function runesByTag(tag: string, mode: GameMode): Build["runes"] {
  if (mode === "arena") {
    return { primary: "Arena", keystone: "Augments situacionais", secondary: "Adaptativo", shards: "Priorize sustain, dano e resistencia por lobby" };
  }

  if (tag === "Marksman") {
    return { primary: "Precision", keystone: "Press the Attack", secondary: "Sorcery", shards: "Attack Speed, Adaptive, Health" };
  }

  if (tag === "Mage") {
    return { primary: "Sorcery", keystone: "Arcane Comet", secondary: "Inspiration", shards: "Ability Haste, Adaptive, Health" };
  }

  if (tag === "Assassin") {
    return { primary: "Domination", keystone: "Electrocute", secondary: "Precision", shards: "Adaptive, Adaptive, Health" };
  }

  if (tag === "Tank" || tag === "Support") {
    return { primary: "Resolve", keystone: "Aftershock", secondary: "Inspiration", shards: "Ability Haste, Armor/MR, Health" };
  }

  return { primary: "Precision", keystone: "Conqueror", secondary: "Resolve", shards: "Attack Speed, Adaptive, Health" };
}

function spellsByRole(role: ChampionRole, mode: GameMode) {
  if (mode === "aram") return ["Flash", "Mark"];
  if (mode === "arena") return ["Flash", "Flee"];
  if (role === "Jungle") return ["Flash", "Smite"];
  if (role === "Top") return ["Flash", "Teleport"];
  if (role === "ADC") return ["Flash", "Barrier"];
  if (role === "Support") return ["Flash", "Ignite"];
  return ["Flash", "Ignite"];
}

function powerSpikesByMode(mode: GameMode, core: CatalogItem[]) {
  const first = core[0]?.name ?? "primeiro item";
  const second = core[1]?.name ?? "segundo item";

  if (mode === "aram") return ["Primeira compra completa", first, "Level 11 com ultimates em sequencia"];
  if (mode === "arena") return ["Primeiro augment", first, "Dois itens com round decisivo"];
  if (mode === "casual") return ["Level 6", first, second];
  return ["Level 6", first, "Dois itens antes do terceiro dragao"];
}

function playPatternByTag(tag: string, mode: GameMode) {
  if (mode === "arena") return ["Jogue em torno do cooldown grande", "Priorize alvo isolado", "Use plantas e zona final para forcar erro"];
  if (mode === "aram") return ["Controle wave antes da luta", "Guarde skill chave para engage inimigo", "Compre sustain quando o poke pesar"];
  if (tag === "Marksman") return ["Bata na frontline segura", "Guarde mobilidade para assassinos", "Transforme primeira kill em reset/objetivo"];
  if (tag === "Mage") return ["Push antes de andar", "Force poke antes do all-in", "Jogue por visao lateral em objetivos"];
  if (tag === "Assassin") return ["Procure flanco sem ward", "Entre depois do controle inimigo", "Converta pick em objetivo"];
  if (tag === "Support") return ["Controle brush", "Jogue pelo cooldown do carry", "Troque engage ruim por peel bom"];
  if (tag === "Tank") return ["Absorva cooldowns", "Inicie quando follow-up estiver perto", "Compre resistencia contra maior ameaca"];
  return ["Trocas curtas ate fechar item", "Pressione side lane com visao", "Entre na luta pelo angulo lateral"];
}

function avoidByMode(mode: GameMode) {
  if (mode === "arena") return ["Separar do aliado", "Gastar tudo antes do ringue fechar", "Ignorar sustain do inimigo"];
  if (mode === "aram") return ["Morrer antes do objetivo de wave", "Comprar item caro demais sem spike", "Facecheck sem cooldowns"];
  if (mode === "ranked") return ["Compra fora do matchup", "Lutar sem prioridade", "Forcar antes do item-chave"];
  return ["Testar sem plano", "Copiar build sem olhar composicao", "Ignorar resistencia necessaria"];
}


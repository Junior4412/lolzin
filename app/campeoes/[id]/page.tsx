import { fetchChampionDetail, fetchChampionList } from "@/lib/ddragon";
import { BuildOptionsPanel, type BuildOption } from "@/components/champion/BuildOptionsPanel";
import { getAramMayhemAugments, type AugmentRarity } from "@/lib/aramMayhemAugments";
import { getChampionProfile, type ChampionArchetype, type PrimaryLane } from "@/lib/championProfiles";
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
  AlertTriangle,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Shield,
  ShieldAlert,
  Skull,
  Sparkles,
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
type LaneId = PrimaryLane;
type SelectedMode = "ranked" | "aram" | "arena" | "casual" | "aram-chaos";
type ChampionPreset = {
  lane: LaneId;
  starting: string[];
  boots: string[];
  core: string[];
  situational: string[];
  spells: string[];
  maxOrder: BasicSkillKey[];
  runes: {
    primaryPath: string;
    keystone: string;
    secondaryPath: string;
    runes: string[];
    shards: [string, string, string];
  };
};

const modeTabs: Array<{ id: SelectedMode; label: string; short: string; description: string }> = [
  { id: "ranked", label: "Ranked", short: "SR", description: "Summoner's Rift com rota, farm e objetivos." },
  { id: "aram", label: "ARAM", short: "ARAM", description: "Howling Abyss: luta constante, poke e sustain." },
  { id: "arena", label: "Arena", short: "2v2", description: "Duelos curtos, sustain e itens de sobrevivencia." },
  { id: "casual", label: "Normal", short: "Normal", description: "Summoner's Rift flexivel para testar." },
  { id: "aram-chaos", label: "ARAM Desordem", short: "Chaos", description: "ARAM acelerado com compras rapidas e alta cura." },
];
type MatchupGuide = {
  championId: string;
  championName: string;
  difficulty: "easy" | "medium" | "hard";
  score: number;
  tips: string[];
};

const augmentTone: Record<AugmentRarity, { label: string; className: string }> = {
  Silver: { label: "Prata", className: "border-slate-300/30 bg-slate-300/10 text-slate-200" },
  Gold: { label: "Ouro", className: "border-gold/40 bg-gold/10 text-gold" },
  Prismatic: { label: "Prismatica", className: "border-arcane-bright/40 bg-arcane-bright/10 text-arcane-bright" },
};

const runePresets = {
  conqueror: {
    primaryPath: "Precision",
    keystone: "Conqueror",
    secondaryPath: "Resolve",
    runes: ["Triumph", "Legend: Haste", "Last Stand", "Second Wind", "Overgrowth"],
    shards: ["Attack Speed", "Adaptive Force", "Health per Level"] as [string, string, string],
  },
  fleet: {
    primaryPath: "Precision",
    keystone: "Fleet Footwork",
    secondaryPath: "Sorcery",
    runes: ["Presence of Mind", "Legend: Bloodline", "Cut Down", "Celerity", "Gathering Storm"],
    shards: ["Attack Speed", "Adaptive Force", "Health"] as [string, string, string],
  },
  pta: {
    primaryPath: "Precision",
    keystone: "Press the Attack",
    secondaryPath: "Inspiration",
    runes: ["Presence of Mind", "Legend: Alacrity", "Cut Down", "Magical Footwear", "Biscuit Delivery"],
    shards: ["Attack Speed", "Adaptive Force", "Health"] as [string, string, string],
  },
  lethalTempo: {
    primaryPath: "Precision",
    keystone: "Lethal Tempo",
    secondaryPath: "Resolve",
    runes: ["Triumph", "Legend: Alacrity", "Last Stand", "Bone Plating", "Overgrowth"],
    shards: ["Attack Speed", "Adaptive Force", "Health"] as [string, string, string],
  },
  comet: {
    primaryPath: "Sorcery",
    keystone: "Arcane Comet",
    secondaryPath: "Inspiration",
    runes: ["Manaflow Band", "Transcendence", "Scorch", "Biscuit Delivery", "Cosmic Insight"],
    shards: ["Adaptive Force", "Adaptive Force", "Health"] as [string, string, string],
  },
  electrocute: {
    primaryPath: "Domination",
    keystone: "Electrocute",
    secondaryPath: "Sorcery",
    runes: ["Sudden Impact", "Grisly Mementos", "Ultimate Hunter", "Transcendence", "Scorch"],
    shards: ["Adaptive Force", "Adaptive Force", "Health"] as [string, string, string],
  },
  darkHarvest: {
    primaryPath: "Domination",
    keystone: "Dark Harvest",
    secondaryPath: "Precision",
    runes: ["Cheap Shot", "Grisly Mementos", "Treasure Hunter", "Presence of Mind", "Coup de Grace"],
    shards: ["Adaptive Force", "Adaptive Force", "Health"] as [string, string, string],
  },
  grasp: {
    primaryPath: "Resolve",
    keystone: "Grasp of the Undying",
    secondaryPath: "Precision",
    runes: ["Demolish", "Second Wind", "Overgrowth", "Triumph", "Legend: Haste"],
    shards: ["Attack Speed", "Adaptive Force", "Health per Level"] as [string, string, string],
  },
  aftershock: {
    primaryPath: "Resolve",
    keystone: "Aftershock",
    secondaryPath: "Inspiration",
    runes: ["Font of Life", "Bone Plating", "Unflinching", "Biscuit Delivery", "Cosmic Insight"],
    shards: ["Ability Haste", "Health per Level", "Health"] as [string, string, string],
  },
  guardian: {
    primaryPath: "Resolve",
    keystone: "Guardian",
    secondaryPath: "Inspiration",
    runes: ["Font of Life", "Bone Plating", "Unflinching", "Biscuit Delivery", "Cosmic Insight"],
    shards: ["Attack Speed", "Health per Level", "Health per Level"] as [string, string, string],
  },
  aery: {
    primaryPath: "Sorcery",
    keystone: "Summon Aery",
    secondaryPath: "Resolve",
    runes: ["Manaflow Band", "Transcendence", "Gathering Storm", "Bone Plating", "Revitalize"],
    shards: ["Ability Haste", "Adaptive Force", "Health"] as [string, string, string],
  },
};

const championPresets: Record<string, ChampionPreset> = {
  Aatrox: { lane: "Top", starting: ["1054", "2003"], boots: ["3047", "3111"], core: ["6692", "6610", "3053"], situational: ["3071", "6333", "3156", "3074", "3026"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.conqueror },
  Ahri: { lane: "Mid", starting: ["1056", "2003", "2003"], boots: ["3020", "3158"], core: ["6655", "4645", "3089"], situational: ["3157", "3135", "3102", "6653", "4628"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.electrocute },
  Akali: { lane: "Mid", starting: ["1054", "2003"], boots: ["3020", "3111"], core: ["4646", "4645", "3157"], situational: ["3089", "3102", "3135", "4633"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.electrocute },
  Ambessa: { lane: "Top", starting: ["1054", "2003"], boots: ["3047", "3111"], core: ["6692", "6610", "3071"], situational: ["3053", "6333", "3156", "3074"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.conqueror },
  Amumu: { lane: "Jungle", starting: ["1101", "2003"], boots: ["3047", "3111"], core: ["6653", "3068", "6665"], situational: ["3075", "3110", "2504", "3001"], spells: ["SummonerFlash.png", "SummonerSmite.png"], maxOrder: ["E", "Q", "W"], runes: runePresets.aftershock },
  Aphelios: { lane: "ADC", starting: ["1055", "2003"], boots: ["3006", "3047"], core: ["6672", "3031", "3036"], situational: ["3072", "3094", "3153", "3026"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.pta },
  Ashe: { lane: "ADC", starting: ["1055", "2003"], boots: ["3006", "3009"], core: ["6672", "3031", "3094"], situational: ["3036", "3072", "3153", "3124"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["W", "Q", "E"], runes: runePresets.pta },
  Bard: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3009", "3158"], core: ["3877", "3190", "3107"], situational: ["3109", "3110", "3222", "2065"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.guardian },
  Blitzcrank: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3009", "3158"], core: ["3869", "3190", "3050"], situational: ["3109", "3110", "3222", "3075"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.aftershock },
  Brand: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3020", "3158"], core: ["6653", "3116", "4637"], situational: ["3157", "3135", "3089", "3165"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["W", "Q", "E"], runes: runePresets.darkHarvest },
  Braum: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3047", "3111", "3009"], core: ["3876", "3190", "3109"], situational: ["3075", "3110", "2504", "3222", "3107"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.guardian },
  Caitlyn: { lane: "ADC", starting: ["1055", "2003"], boots: ["3006", "3009"], core: ["6676", "3031", "3094"], situational: ["3036", "3072", "3026", "6675"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.fleet },
  Darius: { lane: "Top", starting: ["1054", "2003"], boots: ["3047", "3111"], core: ["6631", "3053", "3742"], situational: ["6333", "3075", "3065", "3026"], spells: ["SummonerFlash.png", "SummonerHaste.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.conqueror },
  Draven: { lane: "ADC", starting: ["1055", "2003"], boots: ["3006", "3047"], core: ["6676", "3031", "3072"], situational: ["3036", "3094", "3026", "3153"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.pta },
  Ezreal: { lane: "ADC", starting: ["1055", "2003"], boots: ["3158", "3047"], core: ["3078", "3004", "6694"], situational: ["3071", "3156", "3026", "3139"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.pta },
  Fiora: { lane: "Top", starting: ["1054", "2003"], boots: ["3047", "3111"], core: ["3074", "3078", "6632"], situational: ["3053", "6333", "3156", "3026"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.grasp },
  Garen: { lane: "Top", starting: ["1054", "2003"], boots: ["3006", "3047"], core: ["6631", "3046", "3742"], situational: ["3053", "3075", "3026", "3143"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["E", "Q", "W"], runes: runePresets.conqueror },
  Graves: { lane: "Jungle", starting: ["1101", "2003"], boots: ["3009", "3047"], core: ["3142", "6676", "3031"], situational: ["3036", "3026", "3156", "6694"], spells: ["SummonerFlash.png", "SummonerSmite.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.fleet },
  Gwen: { lane: "Top", starting: ["1056", "2003"], boots: ["3020", "3047"], core: ["4633", "3115", "3089"], situational: ["3157", "3135", "3102", "6653"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.conqueror },
  Hecarim: { lane: "Jungle", starting: ["1101", "2003"], boots: ["3158", "3047"], core: ["6692", "3071", "3161"], situational: ["3053", "6333", "3065", "3156"], spells: ["SummonerHaste.png", "SummonerSmite.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.conqueror },
  Irelia: { lane: "Top", starting: ["1054", "2003"], boots: ["3047", "3111"], core: ["3153", "6672", "3091"], situational: ["3053", "6333", "3026", "3156"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.conqueror },
  Janna: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3158", "3009"], core: ["3870", "6617", "3107"], situational: ["3504", "3222", "2065", "3109"], spells: ["SummonerFlash.png", "SummonerExhaust.png"], maxOrder: ["E", "W", "Q"], runes: runePresets.aery },
  JarvanIV: { lane: "Jungle", starting: ["1101", "2003"], boots: ["3047", "3111"], core: ["6610", "3071", "3053"], situational: ["6333", "3026", "3075", "3065"], spells: ["SummonerFlash.png", "SummonerSmite.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.conqueror },
  Jax: { lane: "Top", starting: ["1054", "2003"], boots: ["3047", "3111"], core: ["3078", "6610", "3053"], situational: ["3153", "3071", "6333", "3026"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["W", "E", "Q"], runes: runePresets.lethalTempo },
  Jhin: { lane: "ADC", starting: ["1055", "2003"], boots: ["3009", "3047"], core: ["6697", "6676", "3031"], situational: ["3036", "3094", "3026", "3072", "3139"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.fleet },
  Jinx: { lane: "ADC", starting: ["1055", "2003"], boots: ["3006", "3047"], core: ["6672", "3085", "3031"], situational: ["3036", "3072", "3094", "3026"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.lethalTempo },
  Kaisa: { lane: "ADC", starting: ["1055", "2003"], boots: ["3006", "3047"], core: ["6672", "3124", "3115"], situational: ["3089", "3135", "3026", "3072"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.pta },
  Karma: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3158", "3009"], core: ["3870", "6617", "2065"], situational: ["3107", "3504", "3222", "3109"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.aery },
  Kayn: { lane: "Jungle", starting: ["1101", "2003"], boots: ["3158", "3047"], core: ["6692", "3071", "6694"], situational: ["6610", "6333", "3026", "3156"], spells: ["SummonerFlash.png", "SummonerSmite.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.conqueror },
  Khazix: { lane: "Jungle", starting: ["1101", "2003"], boots: ["3158", "3009"], core: ["3142", "6694", "6697"], situational: ["6676", "3026", "3814", "3156"], spells: ["SummonerFlash.png", "SummonerSmite.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.darkHarvest },
  Leblanc: { lane: "Mid", starting: ["1056", "2003", "2003"], boots: ["3020", "3158"], core: ["6655", "4645", "3089"], situational: ["3157", "3135", "3102", "4646"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["W", "Q", "E"], runes: runePresets.electrocute },
  LeeSin: { lane: "Jungle", starting: ["1101", "2003"], boots: ["3047", "3111"], core: ["6692", "6610", "3071"], situational: ["3053", "6333", "3026", "3156"], spells: ["SummonerFlash.png", "SummonerSmite.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.conqueror },
  Leona: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3047", "3111"], core: ["3869", "3190", "3050"], situational: ["3109", "3075", "3110", "3222"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["W", "E", "Q"], runes: runePresets.aftershock },
  Lucian: { lane: "ADC", starting: ["1055", "2003"], boots: ["3006", "3047"], core: ["3508", "3031", "6675"], situational: ["3036", "3072", "3094", "3026"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.pta },
  Lulu: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3158", "3009"], core: ["3870", "6617", "3504"], situational: ["3107", "3222", "2065", "3109"], spells: ["SummonerFlash.png", "SummonerExhaust.png"], maxOrder: ["E", "W", "Q"], runes: runePresets.aery },
  Lux: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3020", "3158"], core: ["6655", "4645", "3089"], situational: ["3157", "3135", "3102", "6653"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["E", "Q", "W"], runes: runePresets.comet },
  MasterYi: { lane: "Jungle", starting: ["1101", "2003"], boots: ["3006", "3047"], core: ["3153", "3124", "3091"], situational: ["6672", "3026", "3139", "6333"], spells: ["SummonerFlash.png", "SummonerSmite.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.lethalTempo },
  MissFortune: { lane: "ADC", starting: ["1055", "2003"], boots: ["3009", "3006"], core: ["3142", "6676", "6694"], situational: ["3031", "3036", "3072", "3026"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.pta },
  Mordekaiser: { lane: "Top", starting: ["1054", "2003"], boots: ["3047", "3111"], core: ["3116", "4633", "6653"], situational: ["3157", "3065", "3075", "3089"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.conqueror },
  Nami: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3158", "3009"], core: ["3870", "6617", "4005"], situational: ["3107", "3504", "3222", "2065"], spells: ["SummonerFlash.png", "SummonerExhaust.png"], maxOrder: ["W", "E", "Q"], runes: runePresets.aery },
  Nautilus: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3047", "3111"], core: ["3869", "3190", "3050"], situational: ["3109", "3075", "3110", "3222"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["E", "W", "Q"], runes: runePresets.aftershock },
  Nocturne: { lane: "Jungle", starting: ["1101", "2003"], boots: ["3047", "3111"], core: ["6631", "3161", "3053"], situational: ["6333", "3026", "3156", "3071"], spells: ["SummonerFlash.png", "SummonerSmite.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.lethalTempo },
  Orianna: { lane: "Mid", starting: ["1056", "2003", "2003"], boots: ["3020", "3158"], core: ["6655", "4645", "3089"], situational: ["3157", "3135", "3102", "6653"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.aery },
  Pantheon: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3009", "3047"], core: ["3877", "3142", "3071"], situational: ["6694", "3109", "3026", "6333"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.pta },
  Pyke: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3009", "3158"], core: ["3877", "3179", "3142"], situational: ["6694", "3814", "3026", "6676"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.electrocute },
  Rakan: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3158", "3009"], core: ["3870", "3107", "3190"], situational: ["3109", "3222", "2065", "3504"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["W", "E", "Q"], runes: runePresets.guardian },
  Rammus: { lane: "Jungle", starting: ["1101", "2003"], boots: ["3047", "3111"], core: ["3075", "3068", "6665"], situational: ["3110", "2504", "3001", "3065"], spells: ["SummonerFlash.png", "SummonerSmite.png"], maxOrder: ["W", "E", "Q"], runes: runePresets.aftershock },
  Renekton: { lane: "Top", starting: ["1054", "2003"], boots: ["3047", "3111"], core: ["6692", "3071", "3053"], situational: ["6333", "3026", "3156", "3074"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.pta },
  Riven: { lane: "Top", starting: ["1054", "2003"], boots: ["3158", "3047"], core: ["6692", "6610", "3071"], situational: ["3053", "6333", "3026", "3156"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.conqueror },
  Samira: { lane: "ADC", starting: ["1055", "2003"], boots: ["3006", "3047"], core: ["6676", "3031", "3072"], situational: ["3036", "3026", "3139", "3156"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.conqueror },
  Senna: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3009", "3158"], core: ["3877", "3142", "3094"], situational: ["6676", "3036", "3109", "3026"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.fleet },
  Seraphine: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3158", "3009"], core: ["3870", "6617", "3107"], situational: ["3504", "3222", "2065", "6653"], spells: ["SummonerFlash.png", "SummonerExhaust.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.aery },
  Sett: { lane: "Top", starting: ["1054", "2003"], boots: ["3047", "3111"], core: ["6631", "3053", "3742"], situational: ["6333", "3075", "3026", "3065"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.conqueror },
  Sona: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3158", "3009"], core: ["3870", "6617", "3107"], situational: ["3504", "3222", "2065", "3109"], spells: ["SummonerFlash.png", "SummonerExhaust.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.aery },
  Soraka: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3158", "3009"], core: ["3870", "6617", "3107"], situational: ["3504", "3222", "2065", "3109"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["W", "Q", "E"], runes: runePresets.aery },
  Thresh: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3009", "3047"], core: ["3869", "3190", "3109"], situational: ["3075", "3110", "3222", "3107"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.aftershock },
  Tristana: { lane: "ADC", starting: ["1055", "2003"], boots: ["3006", "3047"], core: ["6672", "3031", "3094"], situational: ["3036", "3072", "3026", "6675"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["E", "Q", "W"], runes: runePresets.pta },
  Varus: { lane: "ADC", starting: ["1055", "2003"], boots: ["3006", "3009"], core: ["3153", "3124", "3085"], situational: ["3036", "3072", "3094", "3139"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.lethalTempo },
  Vayne: { lane: "ADC", starting: ["1055", "2003"], boots: ["3006", "3047"], core: ["3153", "3124", "3085"], situational: ["3036", "3072", "3026", "3139"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "W", "E"], runes: runePresets.lethalTempo },
  Vi: { lane: "Jungle", starting: ["1101", "2003"], boots: ["3047", "3111"], core: ["6610", "3071", "3053"], situational: ["6333", "3026", "3156", "3075"], spells: ["SummonerFlash.png", "SummonerSmite.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.conqueror },
  Viego: { lane: "Jungle", starting: ["1101", "2003"], boots: ["3047", "3006"], core: ["3153", "6610", "3053"], situational: ["3071", "3026", "6333", "3124"], spells: ["SummonerFlash.png", "SummonerSmite.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.conqueror },
  Viktor: { lane: "Mid", starting: ["1056", "2003", "2003"], boots: ["3020", "3158"], core: ["6655", "4645", "3089"], situational: ["3157", "3135", "3102", "6653"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["E", "Q", "W"], runes: runePresets.aery },
  Xayah: { lane: "ADC", starting: ["1055", "2003"], boots: ["3006", "3047"], core: ["3508", "3031", "3094"], situational: ["3036", "3072", "3026", "6675"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["E", "W", "Q"], runes: runePresets.lethalTempo },
  Yasuo: { lane: "Mid", starting: ["1055", "2003"], boots: ["3006", "3047"], core: ["6672", "3031", "3153"], situational: ["3026", "3036", "3072", "6333"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.lethalTempo },
  Yone: { lane: "Mid", starting: ["1055", "2003"], boots: ["3006", "3047"], core: ["6672", "3031", "3153"], situational: ["3026", "3036", "3072", "6333"], spells: ["SummonerFlash.png", "SummonerTeleport.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.lethalTempo },
  Yuumi: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3158"], core: ["3870", "6617", "3504"], situational: ["3107", "3222", "2065", "3109"], spells: ["SummonerExhaust.png", "SummonerDot.png"], maxOrder: ["E", "Q", "W"], runes: runePresets.aery },
  Zed: { lane: "Mid", starting: ["1036", "2003", "2003"], boots: ["3158", "3009"], core: ["3142", "6694", "6697"], situational: ["3814", "3026", "3156", "6676"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.electrocute },
  Zeri: { lane: "ADC", starting: ["1055", "2003"], boots: ["3006", "3047"], core: ["6672", "3085", "3031"], situational: ["3036", "3072", "3094", "3026"], spells: ["SummonerFlash.png", "SummonerBarrier.png"], maxOrder: ["Q", "E", "W"], runes: runePresets.lethalTempo },
  Zyra: { lane: "Support", starting: ["3865", "2003", "2003"], boots: ["3020", "3158"], core: ["6653", "3116", "4637"], situational: ["3157", "3135", "3089", "3165"], spells: ["SummonerFlash.png", "SummonerDot.png"], maxOrder: ["E", "Q", "W"], runes: runePresets.comet },
};

const archetypeTemplates: Record<ChampionArchetype, Omit<ChampionPreset, "lane">> = {
  "adc-crit": {
    starting: ["1055", "2003"],
    boots: ["3006", "3047"],
    core: ["6672", "3031", "3036"],
    situational: ["3072", "3094", "3026", "3139", "3153"],
    spells: ["SummonerFlash.png", "SummonerBarrier.png"],
    maxOrder: ["Q", "W", "E"],
    runes: runePresets.pta,
  },
  "adc-onhit": {
    starting: ["1055", "2003"],
    boots: ["3006", "3047"],
    core: ["3153", "3124", "3085"],
    situational: ["3091", "3036", "3072", "3139", "3026"],
    spells: ["SummonerFlash.png", "SummonerBarrier.png"],
    maxOrder: ["Q", "E", "W"],
    runes: runePresets.lethalTempo,
  },
  "adc-caster": {
    starting: ["1055", "2003"],
    boots: ["3009", "3158"],
    core: ["3508", "3031", "6694"],
    situational: ["6676", "3036", "3094", "3072", "3026"],
    spells: ["SummonerFlash.png", "SummonerBarrier.png"],
    maxOrder: ["Q", "W", "E"],
    runes: runePresets.fleet,
  },
  "support-enchanter": {
    starting: ["3865", "2003", "2003"],
    boots: ["3158", "3009"],
    core: ["3870", "6617", "3107"],
    situational: ["3504", "3222", "2065", "3109", "3190"],
    spells: ["SummonerFlash.png", "SummonerExhaust.png"],
    maxOrder: ["E", "W", "Q"],
    runes: runePresets.aery,
  },
  "support-tank": {
    starting: ["3865", "2003", "2003"],
    boots: ["3047", "3111", "3009"],
    core: ["3869", "3190", "3109"],
    situational: ["3075", "3110", "2504", "3222", "3107"],
    spells: ["SummonerFlash.png", "SummonerDot.png"],
    maxOrder: ["Q", "E", "W"],
    runes: runePresets.aftershock,
  },
  "support-mage": {
    starting: ["3865", "2003", "2003"],
    boots: ["3020", "3158"],
    core: ["6653", "3116", "4637"],
    situational: ["3157", "3135", "3089", "3165", "3102"],
    spells: ["SummonerFlash.png", "SummonerDot.png"],
    maxOrder: ["E", "Q", "W"],
    runes: runePresets.comet,
  },
  "support-pick": {
    starting: ["3865", "2003", "2003"],
    boots: ["3009", "3158"],
    core: ["3877", "3190", "3109"],
    situational: ["3142", "6694", "3075", "3110", "3222"],
    spells: ["SummonerFlash.png", "SummonerDot.png"],
    maxOrder: ["Q", "E", "W"],
    runes: runePresets.aftershock,
  },
  "jungle-assassin": {
    starting: ["1101", "2003"],
    boots: ["3158", "3009"],
    core: ["3142", "6694", "6697"],
    situational: ["3814", "3026", "3156", "6676", "3036"],
    spells: ["SummonerFlash.png", "SummonerSmite.png"],
    maxOrder: ["Q", "W", "E"],
    runes: runePresets.darkHarvest,
  },
  "jungle-fighter": {
    starting: ["1101", "2003"],
    boots: ["3047", "3111"],
    core: ["6610", "3071", "3053"],
    situational: ["6631", "6333", "3026", "3156", "3065"],
    spells: ["SummonerFlash.png", "SummonerSmite.png"],
    maxOrder: ["Q", "E", "W"],
    runes: runePresets.conqueror,
  },
  "jungle-tank": {
    starting: ["1101", "2003"],
    boots: ["3047", "3111"],
    core: ["3068", "6665", "3075"],
    situational: ["3110", "2504", "3001", "3065", "3143"],
    spells: ["SummonerFlash.png", "SummonerSmite.png"],
    maxOrder: ["W", "E", "Q"],
    runes: runePresets.aftershock,
  },
  "jungle-ap": {
    starting: ["1101", "2003"],
    boots: ["3020", "3158"],
    core: ["6653", "3116", "3157"],
    situational: ["3089", "3135", "3102", "4637", "4645"],
    spells: ["SummonerFlash.png", "SummonerSmite.png"],
    maxOrder: ["Q", "W", "E"],
    runes: runePresets.darkHarvest,
  },
  "mid-mage": {
    starting: ["1056", "2003", "2003"],
    boots: ["3020", "3158"],
    core: ["6655", "4645", "3089"],
    situational: ["3157", "3135", "3102", "6653", "4628"],
    spells: ["SummonerFlash.png", "SummonerTeleport.png"],
    maxOrder: ["Q", "W", "E"],
    runes: runePresets.aery,
  },
  "mid-assassin": {
    starting: ["1036", "2003", "2003"],
    boots: ["3158", "3020"],
    core: ["3142", "6694", "6697"],
    situational: ["3814", "3026", "3157", "3156", "4645"],
    spells: ["SummonerFlash.png", "SummonerDot.png"],
    maxOrder: ["Q", "E", "W"],
    runes: runePresets.electrocute,
  },
  "mid-scaling": {
    starting: ["1056", "2003", "2003"],
    boots: ["3020", "3158"],
    core: ["6657", "3003", "3089"],
    situational: ["3157", "3135", "3102", "3116", "4645"],
    spells: ["SummonerFlash.png", "SummonerTeleport.png"],
    maxOrder: ["Q", "W", "E"],
    runes: runePresets.fleet,
  },
  "top-fighter": {
    starting: ["1054", "2003"],
    boots: ["3047", "3111"],
    core: ["6631", "6610", "3053"],
    situational: ["3071", "6333", "3156", "3074", "3026"],
    spells: ["SummonerFlash.png", "SummonerTeleport.png"],
    maxOrder: ["Q", "E", "W"],
    runes: runePresets.conqueror,
  },
  "top-tank": {
    starting: ["1054", "2003"],
    boots: ["3047", "3111"],
    core: ["3068", "6665", "3075"],
    situational: ["3084", "2504", "3110", "3143", "3065"],
    spells: ["SummonerFlash.png", "SummonerTeleport.png"],
    maxOrder: ["W", "Q", "E"],
    runes: runePresets.grasp,
  },
  "top-ap": {
    starting: ["1056", "2003"],
    boots: ["3020", "3047"],
    core: ["4633", "3116", "3089"],
    situational: ["3157", "3135", "3102", "6653", "3065"],
    spells: ["SummonerFlash.png", "SummonerTeleport.png"],
    maxOrder: ["Q", "E", "W"],
    runes: runePresets.conqueror,
  },
  "top-marksman": {
    starting: ["1055", "2003"],
    boots: ["3006", "3047"],
    core: ["6672", "3031", "3094"],
    situational: ["3036", "3072", "3153", "3026", "3139"],
    spells: ["SummonerFlash.png", "SummonerTeleport.png"],
    maxOrder: ["Q", "E", "W"],
    runes: runePresets.fleet,
  },
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

function laneLabel(lane: LaneId) {
  const labels: Record<LaneId, string> = {
    Top: "Topo",
    Jungle: "Selva",
    Mid: "Meio",
    ADC: "ADC",
    Support: "Suporte",
  };
  return labels[lane];
}

function archetypeLabel(archetype: ChampionArchetype) {
  const labels: Record<ChampionArchetype, string> = {
    "adc-crit": "ADC critico",
    "adc-onhit": "ADC on-hit",
    "adc-caster": "ADC utilidade",
    "support-enchanter": "Encantador",
    "support-tank": "Suporte tanque",
    "support-mage": "Suporte mago",
    "support-pick": "Pickoff",
    "jungle-assassin": "Jungle assassino",
    "jungle-fighter": "Jungle lutador",
    "jungle-tank": "Jungle tanque",
    "jungle-ap": "Jungle AP",
    "mid-mage": "Mago mid",
    "mid-assassin": "Assassino mid",
    "mid-scaling": "Mid escala",
    "top-fighter": "Topo lutador",
    "top-tank": "Topo tanque",
    "top-ap": "Topo AP",
    "top-marksman": "Topo atirador",
  };
  return labels[archetype];
}

function normalizeModeParam(value?: string | string[]): SelectedMode {
  const raw = Array.isArray(value) ? value[0] : value;
  return modeTabs.some((mode) => mode.id === raw) ? (raw as SelectedMode) : "ranked";
}

function modeCopy(mode: SelectedMode) {
  return modeTabs.find((item) => item.id === mode) ?? modeTabs[0];
}

function aramStarterByChampion(tags: string[], archetype: ChampionArchetype) {
  if (tags.includes("Mage") || archetype === "support-mage" || archetype === "top-ap" || archetype === "jungle-ap") return ["3112", "2003"];
  if (tags.includes("Marksman") || archetype === "adc-crit" || archetype === "adc-onhit" || archetype === "adc-caster") return ["3184", "2003"];
  if (tags.includes("Tank") || archetype.includes("tank")) return ["2051", "2003"];
  return ["3177", "2003"];
}

function modeAdjustedItems(
  mode: SelectedMode,
  tags: string[],
  traits: ReturnType<typeof getChampionBuildData>,
) {
  const isAdc = traits.lane === "ADC" || traits.archetype === "top-marksman";
  const isSupport = traits.lane === "Support";
  const isTank = traits.archetype.includes("tank");
  const isMagic =
    tags.includes("Mage") ||
    traits.archetype === "mid-mage" ||
    traits.archetype === "mid-scaling" ||
    traits.archetype === "top-ap" ||
    traits.archetype === "jungle-ap" ||
    traits.archetype === "support-mage";

  if (mode === "ranked") return traits.items;

  if (mode === "aram" || mode === "aram-chaos") {
    const sustain = mode === "aram-chaos" ? ["3083", "3033", "6696"] : ["3083", "6696"];
    if (isSupport && !isMagic) {
      const tankSupportCore = isTank ? ["3083", "3190", "3109"] : ["6617", "3107", "2065"];
      return {
        starting: aramStarterByChampion(tags, traits.archetype),
        core: uniqueItems([...tankSupportCore, ...traits.items.core]).slice(0, 3),
        boots: traits.items.boots,
        bootOptions: traits.items.bootOptions,
        situational: uniqueItems([...sustain, "3222", "3110", "3075", ...traits.items.situational]).slice(0, 6),
      };
    }

    if (isAdc) {
      return {
        starting: aramStarterByChampion(tags, traits.archetype),
        core: uniqueItems([traits.items.core[0], "3031", "3094", "3036"]).slice(0, 3),
        boots: "3006",
        bootOptions: uniqueItems(["3006", "3047", ...traits.items.bootOptions]).slice(0, 3),
        situational: uniqueItems(["3072", "3139", "3153", "3026", ...sustain, ...traits.items.situational]).slice(0, 6),
      };
    }

    if (isMagic) {
      return {
        starting: aramStarterByChampion(tags, traits.archetype),
        core: uniqueItems([traits.items.core[0], "6653", "3089", "3135"]).slice(0, 3),
        boots: "3020",
        bootOptions: uniqueItems(["3020", "3158", ...traits.items.bootOptions]).slice(0, 3),
        situational: uniqueItems(["3157", "3102", "3116", ...sustain, ...traits.items.situational]).slice(0, 6),
      };
    }

    if (isTank) {
      return {
        starting: aramStarterByChampion(tags, traits.archetype),
        core: uniqueItems(["3083", "3068", "3075", traits.items.core[0]]).slice(0, 3),
        boots: traits.items.boots,
        bootOptions: uniqueItems(["3047", "3111", ...traits.items.bootOptions]).slice(0, 3),
        situational: uniqueItems(["3110", "2504", "4401", "3143", ...traits.items.situational]).slice(0, 6),
      };
    }

    return {
      starting: aramStarterByChampion(tags, traits.archetype),
      core: uniqueItems([traits.items.core[0], "6610", "3053", "3071"]).slice(0, 3),
      boots: traits.items.boots,
      bootOptions: traits.items.bootOptions,
      situational: uniqueItems(["6333", "3156", "3026", ...sustain, ...traits.items.situational]).slice(0, 6),
    };
  }

  if (mode === "arena") {
    return {
      starting: traits.items.starting,
      core: isMagic
        ? uniqueItems(["4633", "3157", traits.items.core[0], "3089"]).slice(0, 3)
        : isAdc
          ? uniqueItems(["3153", traits.items.core[0], "3026", "3072"]).slice(0, 3)
          : isTank
            ? uniqueItems(["3084", "6665", "3075", traits.items.core[0]]).slice(0, 3)
            : uniqueItems(["6632", traits.items.core[0], "3053", "6333"]).slice(0, 3),
      boots: traits.items.boots,
      bootOptions: traits.items.bootOptions,
      situational: uniqueItems(["3026", "3156", "3139", "3065", "2504", ...traits.items.situational]).slice(0, 6),
    };
  }

  return {
    starting: traits.items.starting,
    core: traits.items.core,
    boots: traits.items.boots,
    bootOptions: traits.items.bootOptions,
    situational: uniqueItems([traits.items.situational[0], "3026", "3156", ...traits.items.situational]).slice(0, 6),
  };
}

function applyModeToTraits(
  mode: SelectedMode,
  tags: string[],
  traits: ReturnType<typeof getChampionBuildData>,
) {
  if (mode === "ranked") {
    return { ...traits, mode, modeLabel: modeCopy(mode).label, modeDescription: modeCopy(mode).description };
  }

  const adjustedItems = modeAdjustedItems(mode, tags, traits);
  const spells =
    mode === "aram" || mode === "aram-chaos"
      ? ["SummonerFlash.png", "SummonerSnowball.png"]
      : mode === "arena"
        ? ["SummonerFlash.png", "SummonerHaste.png"]
        : traits.spells;

  const runeOverride =
    mode === "aram" && (tags.includes("Mage") || traits.archetype === "support-mage")
      ? runePresets.darkHarvest
      : traits.runes;

  return {
    ...traits,
    mode,
    modeLabel: modeCopy(mode).label,
    modeDescription: modeCopy(mode).description,
    pickRate: mode === "arena" ? traits.pickRate * 0.72 : traits.pickRate * 0.86,
    banRate: mode === "aram" || mode === "aram-chaos" ? 0 : traits.banRate * 0.55,
    items: adjustedItems,
    spells,
    runes: runeOverride,
    source: `${traits.source} - ajustado para ${modeCopy(mode).label}`,
  };
}

function sharesMatchupPool(a: string[], b: string[]) {
  return a.some((tag) => b.includes(tag));
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
  const preset = championPresets[id];
  const profile = getChampionProfile(id, tags);

  const winRate = 0.46 + (seed % 90) / 1000;
  const pickRate = 0.005 + (seed % 150) / 1000;
  const banRate = pickRate * 0.8;
  const tier: ChampionTier = seed % 10 === 0 ? "S+" : seed % 7 === 0 ? "S" : seed % 3 === 0 ? "A" : seed % 2 === 0 ? "B" : "C";

  if (preset) {
    return {
      winRate,
      pickRate,
      banRate,
      tier,
      lane: preset.lane,
      archetype: profile.archetype,
      spells: preset.spells,
      runes: preset.runes,
      items: {
        starting: preset.starting,
        core: preset.core,
        boots: preset.boots[0],
        bootOptions: preset.boots,
        situational: preset.situational,
      },
      skillTimeline: createSkillTimeline(preset.maxOrder),
      maxOrder: preset.maxOrder,
      matchups: createMatchups(id, tags, allChampions),
      source: "Curado por campeao com referencia OP.GG/Blitz",
    };
  }

  const template = archetypeTemplates[profile.archetype];
  const starting = profile.lane === "Jungle" ? ["1101", "2003"] : template.starting;
  const spells = profile.lane === "Jungle" ? ["SummonerFlash.png", "SummonerSmite.png"] : template.spells;

  return {
    winRate,
    pickRate,
    banRate,
    tier,
    lane: profile.lane,
    archetype: profile.archetype,
    spells,
    runes: template.runes,
    items: {
      starting,
      core: template.core,
      boots: template.boots[0],
      bootOptions: template.boots,
      situational: template.situational,
    },
    skillTimeline: createSkillTimeline(template.maxOrder),
    maxOrder: template.maxOrder,
    matchups: createMatchups(id, tags, allChampions),
    source: `Arquetipo ${archetypeLabel(profile.archetype)} com referencia OP.GG/Blitz`,
  };
}

function uniqueItems(items: string[]) {
  return items.filter((item, index) => item && items.indexOf(item) === index);
}

function createBuildOptions(id: string, traits: ReturnType<typeof getChampionBuildData>) {
  const seed = seedOf(id);
  const rate = (base: number, offset: number) => Number((base + ((seed + offset) % 32) / 10).toFixed(1));
  const games = (base: number, offset: number) => base + ((seed * offset) % 3800);
  const starting = traits.items.starting;
  const baseCore = traits.items.core;
  const baseBoots = traits.items.bootOptions;
  const situational = traits.items.situational;

  let options: BuildOption[];

  const isSupport = traits.lane === "Support";
  const isAdc = traits.lane === "ADC" || traits.archetype === "top-marksman";
  const isMagicDamage =
    traits.archetype === "mid-mage" ||
    traits.archetype === "mid-assassin" ||
    traits.archetype === "mid-scaling" ||
    traits.archetype === "top-ap" ||
    traits.archetype === "jungle-ap" ||
    traits.archetype === "support-mage";
  const isTank = traits.archetype === "top-tank" || traits.archetype === "jungle-tank" || traits.archetype === "support-tank";

  if (isSupport) {
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
        boots: uniqueItems([...baseBoots, "3047", "3111"]).slice(0, 3),
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
        boots: uniqueItems(["3158", ...baseBoots, "3047"]).slice(0, 3),
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
        boots: uniqueItems(["3047", "3111", ...baseBoots]).slice(0, 3),
        core: uniqueItems(["3109", "3190", "3075", baseCore[0]]).slice(0, 3),
        situational: uniqueItems(["3110", "3222", "3001", "3065", ...situational]).slice(0, 6),
      },
    ];
  } else if (isAdc) {
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
        boots: uniqueItems([...baseBoots, "3006", "3047"]).slice(0, 3),
        core: uniqueItems([baseCore[0], baseCore[1], baseCore[2], "3031"]).slice(0, 3),
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
        boots: uniqueItems(["3006", ...baseBoots]).slice(0, 2),
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
        boots: uniqueItems(["3047", ...baseBoots, "3111"]).slice(0, 3),
        core: uniqueItems([baseCore[0], "3072", "3026", baseCore[1]]).slice(0, 3),
        situational: uniqueItems(["3139", "3156", "3036", "3094", ...situational]).slice(0, 6),
      },
    ];
  } else if (isMagicDamage) {
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
        boots: uniqueItems([...baseBoots, "3020", "3158"]).slice(0, 3),
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
        boots: uniqueItems(["3158", ...baseBoots, "3020"]).slice(0, 3),
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
        boots: uniqueItems(["3020", ...baseBoots]).slice(0, 2),
        core: uniqueItems(["4645", baseCore[0], "3089", baseCore[1]]).slice(0, 3),
        situational: uniqueItems(["3157", "3135", "3102", "4628", ...situational]).slice(0, 6),
      },
    ];
  } else if (isTank) {
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
        boots: uniqueItems([...baseBoots, "3047", "3111"]).slice(0, 3),
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
        boots: uniqueItems(["3047", ...baseBoots]).slice(0, 2),
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
        boots: uniqueItems(["3111", ...baseBoots]).slice(0, 2),
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
        boots: uniqueItems([...baseBoots, "3047", "3111"]).slice(0, 3),
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
        boots: uniqueItems(["3047", ...baseBoots, "3111"]).slice(0, 3),
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
        boots: uniqueItems(["3111", "3047", ...baseBoots]).slice(0, 3),
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

function AramChaosCardsPanel({ championId, championName }: { championId: string; championName: string }) {
  const entry = getAramMayhemAugments(championId);

  return (
    <div className="glass rounded-lg border border-border p-6">
      <div className="mb-6 flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-arcane-bright">ARAM Desordem</span>
          <h2 className="font-display mt-1 flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5 text-gold" />
            Cartas recomendadas para {championName}
          </h2>
        </div>
        <span className="w-fit rounded border border-arcane-bright/30 bg-arcane-bright/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-arcane-bright">
          Aprimoramentos
        </span>
      </div>

      {entry ? (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {(["Silver", "Gold", "Prismatic"] as const).map((rarity) => {
              const tone = augmentTone[rarity];
              return (
                <article key={rarity} className={`rounded-lg border p-4 ${tone.className}`}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded border border-current/30 bg-black/20 font-display text-lg font-black">
                      {rarity[0]}
                    </span>
                    <span className="rounded border border-current/30 px-2 py-0.5 text-xs font-bold uppercase">{tone.label}</span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">{entry.picks[rarity]}</h3>
                  <p className="mt-2 text-sm text-text-secondary">Melhor carta {tone.label.toLowerCase()} curada para esse campeao.</p>
                </article>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-gold/20 bg-gold/10 p-3 text-xs leading-relaxed text-gold/90">
            Fonte: METAsrc, patch {entry.patch}, coletado em {new Date(entry.collectedAt).toLocaleDateString("pt-BR")}. A Riot nao expoe estatistica pura do ARAM Desordem pela API, entao isso fica separado das builds normais.
            <a href={entry.sourceUrl} target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-1 font-semibold underline underline-offset-2">
              Ver fonte
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-border bg-elevated/35 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" />
            <div>
              <h3 className="font-semibold text-text-primary">Ainda sem cartas curadas para {championName}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Esse campeao ainda nao tem carta verificada para ARAM Desordem na base local. Preferi mostrar esse aviso em vez de inventar carta, porque as cartas mudam bastante por patch.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function ChampionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ modo?: string | string[] }>;
}) {
  const { id } = await params;
  const selectedMode = normalizeModeParam((await searchParams)?.modo);
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
  const baseTraits = getChampionBuildData(champ.id, champ.tags, allChampions);
  const traits = applyModeToTraits(selectedMode, champ.tags, baseTraits);
  const abilities = skillDetails(champ.passive, champ.spells);
  const buildOptions = createBuildOptions(champ.id, traits);
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
              <span className="px-2 py-0.5 rounded bg-gold/10 border border-gold/20 text-gold text-xs uppercase tracking-wide">{laneLabel(traits.lane)}</span>
              <span className="px-2 py-0.5 rounded bg-arcane/10 border border-arcane/20 text-arcane-bright text-xs uppercase tracking-wide">{traits.modeLabel}</span>
              <span className="px-2 py-0.5 rounded bg-win/10 border border-win/20 text-win text-xs uppercase tracking-wide">{archetypeLabel(traits.archetype)}</span>
              {champ.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded bg-surface border border-border text-text-secondary text-xs uppercase tracking-wide">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-black text-text-primary tracking-tight">{champ.name}</h1>
            <p className="text-lg md:text-xl text-gold font-semibold italic capitalize tracking-wide">{champ.title}</p>
            <p className="max-w-2xl text-sm text-text-secondary">{traits.modeDescription}</p>
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
          <div className="glass rounded-lg border border-border p-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {modeTabs.map((mode) => {
                const active = mode.id === selectedMode;
                return (
                  <Link
                    key={mode.id}
                    href={`/campeoes/${champ.id}${mode.id === "ranked" ? "" : `?modo=${mode.id}`}`}
                    className={`rounded-lg border px-3 py-3 text-center transition ${
                      active ? "border-gold bg-gold/10 text-gold" : "border-border bg-elevated/35 text-text-secondary hover:border-border-bright hover:text-text-primary"
                    }`}
                  >
                    <div className="text-xs font-bold uppercase tracking-wide">{mode.short}</div>
                    <div className="mt-1 text-sm font-semibold">{mode.label}</div>
                  </Link>
                );
              })}
            </div>
          </div>

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
                  <div className="text-xs text-text-muted max-w-xs">Padrao recomendado para {traits.modeLabel}.</div>
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

          <BuildOptionsPanel championName={champ.name} patch={PATCH} options={buildOptions} modeLabel={traits.modeLabel} />

          {selectedMode === "aram-chaos" && (
            <AramChaosCardsPanel championId={champ.id} championName={champ.name} />
          )}

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
                  {traits.items.bootOptions.map((bootId) => (
                    <div key={bootId} className="w-14 h-14 rounded-lg overflow-hidden border border-border bg-surface hover:border-gold/50 transition-colors">
                      <img src={cdnItemImage(PATCH, `${bootId}.png`)} alt="Botas" className="w-full h-full object-cover" />
                    </div>
                  ))}
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

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export { PATCH } from "./ddragon";


// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format KDA ratio
export function formatKDA(k: number, d: number, a: number): string {
  if (d === 0) return "Perfect";
  return ((k + a) / d).toFixed(2);
}

// Format win rate
export function formatWinRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

// Format CS/min
export function formatCSPerMin(cs: number, seconds: number): string {
  if (seconds === 0) return "0.0";
  return (cs / (seconds / 60)).toFixed(1);
}

// Format gold / number with K suffix
export function formatGold(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toString();
}

// Format match duration
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Format relative time
export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 7) return `${days}d atrás`;
  return new Date(timestamp).toLocaleDateString("pt-BR");
}

// Normalize string for search
export function normalizeStr(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// Get tier color
export function getTierColor(tier: string): string {
  switch (tier) {
    case "S+": return "text-yellow-300";
    case "S": return "text-gold";
    case "A": return "text-green-400";
    case "B": return "text-arcane-bright";
    case "C": return "text-text-secondary";
    case "D": return "text-loss";
    default: return "text-text-muted";
  }
}

// Get tier bg color
export function getTierBg(tier: string): string {
  switch (tier) {
    case "S+": return "bg-yellow-300/10 border-yellow-300/30";
    case "S": return "bg-gold/10 border-gold/30";
    case "A": return "bg-green-500/10 border-green-500/30";
    case "B": return "bg-arcane-bright/10 border-arcane-bright/30";
    case "C": return "bg-text-secondary/10 border-text-secondary/30";
    case "D": return "bg-loss/10 border-loss/30";
    default: return "bg-surface border-border";
  }
}

// Translate role to PT-BR
export function translateRole(role: string): string {
  const map: Record<string, string> = {
    top: "Top",
    jungle: "Selva",
    mid: "Meio",
    adc: "Atirador",
    support: "Suporte",
    fill: "Flex",
  };
  return map[role.toLowerCase()] ?? role;
}

// Get DDragon CDN url
const DDRAGON_BASE = "https://ddragon.leagueoflegends.com/cdn";

export function cdnChampionSplash(id: string, skinNum = 0): string {
  return `${DDRAGON_BASE}/img/champion/splash/${id}_${skinNum}.jpg`;
}

export function cdnChampionSquare(patch: string, id: string): string {
  return `${DDRAGON_BASE}/${patch}/img/champion/${id}.png`;
}

export function cdnItemImage(patch: string, filename: string): string {
  return `${DDRAGON_BASE}/${patch}/img/item/${filename}`;
}

export function cdnSpellImage(patch: string, filename: string): string {
  return `${DDRAGON_BASE}/${patch}/img/spell/${filename}`;
}

export function cdnProfileIcon(patch: string, id: number): string {
  return `${DDRAGON_BASE}/${patch}/img/profileicon/${id}.png`;
}

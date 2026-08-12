// ============================================================
// DDragon Client — Centralized fetch layer with caching
// ============================================================

export const PATCH = "16.16.1";
const BASE = `https://ddragon.leagueoflegends.com/cdn/${PATCH}`;
const CACHE_TTL = 3600; // 1h

type FetchOptions = {
  revalidate?: number;
  tags?: string[];
};

async function ddragonFetch<T>(path: string, opts?: FetchOptions): Promise<T> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    next: {
      revalidate: opts?.revalidate ?? CACHE_TTL,
      tags: opts?.tags,
    },
  });
  if (!res.ok) throw new Error(`DDragon fetch failed: ${url} → ${res.status}`);
  return res.json() as Promise<T>;
}

export interface RawChampionList {
  data: Record<string, {
    id: string;
    key: string;
    name: string;
    title: string;
    tags: string[];
    image: { full: string };
    stats: Record<string, number>;
    blurb: string;
    partype: string;
  }>;
}

export interface RawChampionDetail {
  data: Record<string, {
    id: string;
    key: string;
    name: string;
    title: string;
    tags: string[];
    image: { full: string };
    stats: Record<string, number>;
    skins: { id: string; num: number; name: string; chromas: boolean }[];
    spells: {
      id: string;
      name: string;
      description: string;
      image: { full: string };
      cooldown: number[];
      cost: number[];
      range: number[];
    }[];
    passive: { name: string; description: string; image: { full: string } };
    lore: string;
    allytips: string[];
    enemytips: string[];
    blurb: string;
    partype: string;
  }>;
}

export interface RawItemList {
  data: Record<string, {
    name: string;
    description: string;
    gold: { base: number; total: number; sell: number; purchasable: boolean };
    image: { full: string };
    tags: string[];
    stats: Record<string, number>;
    depth?: number;
    from?: string[];
    into?: string[];
  }>;
}

export async function fetchChampionList(): Promise<RawChampionList> {
  return ddragonFetch<RawChampionList>("/data/pt_BR/champion.json", {
    tags: ["champions"],
  });
}

export async function fetchChampionDetail(id: string): Promise<RawChampionDetail> {
  return ddragonFetch<RawChampionDetail>(`/data/pt_BR/champion/${id}.json`, {
    tags: [`champion-${id}`],
  });
}

export async function fetchItemList(): Promise<RawItemList> {
  return ddragonFetch<RawItemList>("/data/pt_BR/item.json", {
    tags: ["items"],
  });
}

export async function fetchLatestPatch(): Promise<string> {
  try {
    const res = await fetch("https://ddragon.leagueoflegends.com/api/versions.json", {
      next: { revalidate: 86400 }, // 24h
    });
    const versions: string[] = await res.json();
    return versions[0] ?? PATCH;
  } catch {
    return PATCH;
  }
}

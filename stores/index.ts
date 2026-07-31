"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favorites: string[];
  toggle: (championId: string) => void;
  isFavorite: (championId: string) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggle: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),
      clear: () => set({ favorites: [] }),
    }),
    { name: "lolzin-favorites" }
  )
);

// ---- Filters Store ----
interface FilterState {
  role: string;
  tier: string;
  search: string;
  mode: string;
  sortBy: string;
  setRole: (role: string) => void;
  setTier: (tier: string) => void;
  setSearch: (search: string) => void;
  setMode: (mode: string) => void;
  setSortBy: (sortBy: string) => void;
  reset: () => void;
}

const defaultFilters = {
  role: "all",
  tier: "all",
  search: "",
  mode: "sr",
  sortBy: "tier",
};

export const useFiltersStore = create<FilterState>()((set) => ({
  ...defaultFilters,
  setRole: (role) => set({ role }),
  setTier: (tier) => set({ tier }),
  setSearch: (search) => set({ search }),
  setMode: (mode) => set({ mode }),
  setSortBy: (sortBy) => set({ sortBy }),
  reset: () => set(defaultFilters),
}));

// ---- Preferences Store ----
interface PreferencesState {
  language: "pt-BR" | "en-US";
  theme: "dark" | "darker";
  compactMode: boolean;
  setLanguage: (lang: "pt-BR" | "en-US") => void;
  setTheme: (theme: "dark" | "darker") => void;
  setCompactMode: (compact: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      language: "pt-BR",
      theme: "dark",
      compactMode: false,
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setCompactMode: (compactMode) => set({ compactMode }),
    }),
    { name: "lolzin-preferences" }
  )
);

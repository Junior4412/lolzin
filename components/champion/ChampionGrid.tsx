"use client";

import { useMemo } from "react";
import { ChampionCard } from "./ChampionCard";
import { useFiltersStore, useFavoritesStore } from "@/stores";
import { normalizeStr, PATCH } from "@/lib/utils";
import type { ChampionMeta } from "@/types";
import { Search, X } from "lucide-react";
import { Button, SectionHeader } from "@/components/ui";

interface ChampionGridProps {
  champions: ChampionMeta[];
}

const ROLES = [
  { id: "all", label: "Todos" },
  { id: "Top", label: "Top" },
  { id: "Jungle", label: "Jungle" },
  { id: "Mid", label: "Mid" },
  { id: "ADC", label: "ADC" },
  { id: "Support", label: "Suporte" },
];

const TIERS = [
  { id: "all", label: "Todos os Tiers" },
  { id: "S+", label: "God Tier (S+)" },
  { id: "S", label: "S" },
  { id: "A", label: "A" },
  { id: "B", label: "B" },
];

export function ChampionGrid({ champions }: ChampionGridProps) {
  const { role, tier, search, sortBy, setRole, setTier, setSearch, setSortBy, reset } = useFiltersStore();
  useFavoritesStore();

  const filtered = useMemo(() => {
    let result = champions;
    if (search) {
      const q = normalizeStr(search);
      result = result.filter(c => normalizeStr(c.name).includes(q));
    }
    if (role !== "all") {
      result = result.filter(c => c.roles.includes(role as any));
    }
    if (tier !== "all") {
      result = result.filter(c => c.tier === tier);
    }
    
    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "winrate") return b.winRate - a.winRate;
      if (sortBy === "pickrate") return b.pickRate - a.pickRate;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      
      // Default: Tier (S+ > S > A > B > C > D)
      const t = { "S+": 6, "S": 5, "A": 4, "B": 3, "C": 2, "D": 1 };
      const ta = t[a.tier as keyof typeof t] || 0;
      const tb = t[b.tier as keyof typeof t] || 0;
      if (ta !== tb) return tb - ta;
      return b.winRate - a.winRate;
    });

    return result;
  }, [champions, role, tier, search, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Filters Bar */}
      <div className="glass rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-card">
        
        {/* Roles */}
        <div className="flex bg-elevated rounded-lg p-1 border border-border">
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${
                role === r.id 
                  ? "bg-gold text-void shadow-gold-sm" 
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Search & Extra Filters */}
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar campeão..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg pl-9 pr-8 py-1.5 text-sm outline-none focus:border-gold/50 transition-colors placeholder:text-text-muted"
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-gold/50 text-text-primary cursor-pointer"
          >
            {TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <SectionHeader 
        title="Campeões" 
        subtitle={`Exibindo ${filtered.length} resultados no Patch ${PATCH}`}
        action={
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-gold/50 text-text-primary cursor-pointer"
          >
            <option value="tier">Ordernar: Tier</option>
            <option value="winrate">Ordernar: Win Rate</option>
            <option value="pickrate">Ordernar: Pick Rate</option>
            <option value="name">Ordernar: Nome</option>
          </select>
        }
      />

      {filtered.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center py-24 rounded-xl border border-dashed border-border text-center">
          <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4 border border-border">
            <Search className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-xl font-display font-bold text-text-primary mb-2">Nenhum campeão encontrado</h3>
          <p className="text-text-secondary mb-6 max-w-md">
            Não encontramos nenhum campeão que corresponda aos filtros atuais. Tente limpar os filtros ou buscar por outro termo.
          </p>
          <Button variant="outline" onClick={reset}>Limpar Filtros</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map(c => (
            <ChampionCard key={c.id} champion={c} patch={PATCH} />
          ))}
        </div>
      )}
    </div>
  );
}

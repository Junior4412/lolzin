"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { cn, normalizeStr, cdnChampionSquare, PATCH } from "@/lib/utils";
import {
  Search,
  Sword,
  BarChart2,
  Layers,
  Star,
  Menu,
  X,
  ChevronRight,
  Zap,
  Gamepad2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/campeoes", label: "Campeões", icon: Sword },
  { href: "/meta", label: "Meta", icon: BarChart2 },
  { href: "/builds", label: "Builds", icon: Layers },
  { href: "/modos", label: "Modos", icon: Gamepad2 },
  { href: "/estatisticas", label: "Perfil", icon: Star },
];

interface QuickResult {
  id: string;
  name: string;
  image: string;
  subtitle: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<QuickResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  function openSearch() {
    setCurrentMode(new URLSearchParams(window.location.search).get("modo"));
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  }

  // Scroll effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const syncMode = () => {
      setCurrentMode(new URLSearchParams(window.location.search).get("modo"));
    };

    syncMode();
    window.addEventListener("popstate", syncMode);
    return () => window.removeEventListener("popstate", syncMode);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }
    const norm = normalizeStr(searchQuery);
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${PATCH}/data/pt_BR/champion.json`,
          { cache: "force-cache" }
        );
        const json = await res.json();
        const filtered: QuickResult[] = Object.values(json.data as Record<string, { id: string; name: string; title: string }>)
          .filter((c) => normalizeStr(c.name).includes(norm))
          .slice(0, 6)
          .map((c) => ({
            id: c.id,
            name: c.name,
            image: cdnChampionSquare(PATCH, c.id),
            subtitle: c.title,
          }));
        setResults(filtered);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const visibleResults = searchQuery.trim() ? results : [];
  const isSearching = Boolean(searchQuery.trim()) && loading;
  const modeSuffix = currentMode && currentMode !== "ranked" ? `?modo=${currentMode}` : "";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-void/35 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gold rounded rotate-45 opacity-80 group-hover:opacity-100 transition-opacity" />
              <Zap className="absolute inset-0 m-auto w-4 h-4 text-void z-10" />
            </div>
            <span className="font-display text-xl font-bold tracking-widest text-gold-gradient hidden sm:block">
              LOLZIN
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-text-secondary transition-all duration-200",
                  "hover:text-gold hover:bg-gold/10 hover:shadow-[inset_0_-1px_0_rgba(200,168,90,0.35)]"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Patch badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-gold/10 border border-gold/20 rounded px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-win animate-pulse" />
            <span className="text-xs font-mono text-gold">Patch {PATCH}</span>
          </div>

          {/* Search button */}
          <button
            onClick={openSearch}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded border transition-all duration-200 text-sm cursor-pointer",
              "border-border text-text-muted hover:border-gold/45 hover:text-text-secondary",
              "bg-surface/70 hover:bg-elevated"
            )}
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:block">Buscar campeão...</span>
            <kbd className="hidden lg:block text-xs bg-elevated border border-border rounded px-1 py-0.5 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-border overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {label}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setSearchOpen(false); setSearchQuery(""); } }}
          >
            <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-xl glass-gold rounded-xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-5 h-5 text-gold flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar campeão..."
                  className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-base font-body"
                />
                <kbd
                  className="text-xs text-text-muted border border-border rounded px-1.5 py-0.5 font-mono cursor-pointer"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto">
                {isSearching && (
                  <div className="p-4 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-border border-t-gold rounded-full animate-spin" />
                  </div>
                )}
                {!isSearching && visibleResults.length === 0 && searchQuery && (
                  <p className="text-center text-text-muted text-sm py-6">Nenhum campeão encontrado</p>
                )}
                {!isSearching && visibleResults.length === 0 && !searchQuery && (
                  <p className="text-center text-text-muted text-sm py-6">Digite para buscar campeões...</p>
                )}
                {visibleResults.map((r) => (
                  <Link
                    key={r.id}
                    href={`/campeoes/${r.id}${modeSuffix}`}
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-elevated transition-colors cursor-pointer"
                  >
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-10 h-10 rounded-lg object-cover border border-border"
                    />
                    <div>
                      <div className="text-text-primary font-semibold text-sm">{r.name}</div>
                      <div className="text-text-muted text-xs capitalize">{r.subtitle}</div>
                    </div>
                    <ChevronRight className="ml-auto w-4 h-4 text-text-muted" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}

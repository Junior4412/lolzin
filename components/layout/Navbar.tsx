"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn, normalizeStr, cdnChampionSquare, PATCH } from "@/lib/utils";
import {
  BarChart2,
  ChevronRight,
  Gamepad2,
  Layers,
  Menu,
  Search,
  Star,
  Sword,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "/campeoes", label: "Campeoes", icon: Sword },
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

  useEffect(() => {
    if (!searchQuery.trim()) return;

    const norm = normalizeStr(searchQuery);
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${PATCH}/data/pt_BR/champion.json`,
          { cache: "force-cache" }
        );
        const json = await res.json();
        const filtered: QuickResult[] = Object.values(
          json.data as Record<string, { id: string; name: string; title: string }>
        )
          .filter((champion) => normalizeStr(champion.name).includes(norm))
          .slice(0, 6)
          .map((champion) => ({
            id: champion.id,
            name: champion.name,
            image: cdnChampionSquare(PATCH, champion.id),
            subtitle: champion.title,
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
          "blitz-topbar fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          scrolled && "shadow-[0_10px_32px_rgba(0,0,0,0.36)]"
        )}
      >
        <div className="mx-auto flex h-12 max-w-[1440px] items-center gap-3 px-3 sm:px-5">
          <Link href="/" className="group flex flex-shrink-0 items-center gap-2">
            <div className="relative h-7 w-7">
              <div className="absolute inset-0 rotate-45 rounded bg-gold opacity-90 transition-opacity group-hover:opacity-100" />
              <Zap className="absolute inset-0 z-10 m-auto h-3.5 w-3.5 text-void" />
            </div>
            <span className="hidden text-lg font-black tracking-wider text-gold sm:block">LOLZIN</span>
          </Link>

          <nav className="ml-2 hidden items-center gap-0.5 md:flex">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex h-8 items-center gap-1.5 rounded px-2.5 text-xs font-bold text-text-secondary transition hover:bg-elevated hover:text-text-primary"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </nav>

          <button
            onClick={openSearch}
            className="mx-auto hidden h-8 min-w-[320px] max-w-xl flex-1 cursor-pointer items-center gap-2 rounded border border-border bg-elevated/70 px-3 text-xs text-text-muted transition hover:border-border-bright hover:text-text-secondary lg:flex"
          >
            <Search className="h-4 w-4" />
            <span className="text-left">Buscar campeao, build ou jogador...</span>
            <kbd className="ml-auto rounded border border-border bg-void px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
              Ctrl K
            </kbd>
          </button>

          <div className="flex-1 lg:hidden" />

          <div className="hidden items-center gap-1.5 rounded border border-border bg-elevated/60 px-2.5 py-1 lg:flex">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-win" />
            <span className="font-mono text-[11px] text-gold">Patch {PATCH}</span>
          </div>

          <button
            className="rounded p-2 text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden blitz-subnav overflow-hidden"
            >
              <div className="space-y-1 px-4 py-3">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded px-3 py-2.5 text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh]"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSearchOpen(false);
                setSearchQuery("");
              }
            }}
          >
            <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="glass-gold relative w-full max-w-xl overflow-hidden rounded-lg shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="h-5 w-5 flex-shrink-0 text-gold" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar campeao..."
                  className="font-body flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted"
                />
                <kbd
                  className="cursor-pointer rounded border border-border px-1.5 py-0.5 font-mono text-xs text-text-muted"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  ESC
                </kbd>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {isSearching && (
                  <div className="flex items-center justify-center p-4">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-gold" />
                  </div>
                )}
                {!isSearching && visibleResults.length === 0 && searchQuery && (
                  <p className="py-6 text-center text-sm text-text-muted">Nenhum campeao encontrado</p>
                )}
                {!isSearching && visibleResults.length === 0 && !searchQuery && (
                  <p className="py-6 text-center text-sm text-text-muted">Digite para buscar campeoes...</p>
                )}
                {visibleResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/campeoes/${result.id}${modeSuffix}`}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-elevated"
                  >
                    <img
                      src={result.image}
                      alt={result.name}
                      className="h-10 w-10 rounded border border-border object-cover"
                    />
                    <div>
                      <div className="text-sm font-semibold text-text-primary">{result.name}</div>
                      <div className="text-xs capitalize text-text-muted">{result.subtitle}</div>
                    </div>
                    <ChevronRight className="ml-auto h-4 w-4 text-text-muted" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-12" />
    </>
  );
}

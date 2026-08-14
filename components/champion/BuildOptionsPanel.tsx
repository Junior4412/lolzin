"use client";

import { useMemo, useState } from "react";
import { Check, ChevronRight, ClipboardList, Plus, RefreshCcw, Shield } from "lucide-react";
import { cdnItemImage } from "@/lib/utils";

export type BuildOption = {
  id: string;
  label: string;
  badge: string;
  description: string;
  pickRate: number;
  winRate: number;
  games: number;
  starting: string[];
  boots: string[];
  core: string[];
  situational: string[];
};

type BuildOptionsPanelProps = {
  championName: string;
  patch: string;
  options: BuildOption[];
  modeLabel?: string;
};

function InlineItem({ patch, itemId, size = "md" }: { patch: string; itemId: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-10 w-10" : "h-12 w-12";

  return (
    <div className={`${sizeClass} overflow-hidden rounded-lg border border-border bg-surface`}>
      <img src={cdnItemImage(patch, `${itemId}.png`)} alt="Item" className="h-full w-full object-cover" />
    </div>
  );
}

export function BuildOptionsPanel({ championName, patch, options, modeLabel = "Ranked" }: BuildOptionsPanelProps) {
  const [selectedId, setSelectedId] = useState(options[0]?.id ?? "");
  const [customItems, setCustomItems] = useState<string[]>([]);
  const selected = options.find((option) => option.id === selectedId) ?? options[0];

  const finalItems = useMemo(() => {
    if (!selected) return [];
    return [...selected.core, ...customItems].slice(0, 5);
  }, [customItems, selected]);

  if (!selected) return null;

  const toggleSituational = (itemId: string) => {
    setCustomItems((current) => {
      if (current.includes(itemId)) return current.filter((id) => id !== itemId);
      return [...current, itemId].slice(0, 2);
    });
  };

  const chooseOption = (id: string) => {
    setSelectedId(id);
    setCustomItems([]);
  };

  return (
    <div className="blitz-card rounded p-4">
      <div className="mb-4 flex flex-col gap-2 border-b border-border pb-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-black">
            <ClipboardList className="h-4 w-4 text-gold" />
            Opcoes de build mais usadas
          </h2>
          <p className="mt-1 text-xs text-text-secondary">
            Inspirado no fluxo do OP.GG: escolha uma itemizacao de {modeLabel} e complete com 4o/5o item situacional.
          </p>
        </div>
        <span className="w-fit rounded border border-border bg-elevated px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-text-secondary">
          {championName} - {modeLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
        {options.map((option) => {
          const active = option.id === selected.id;

          return (
            <button
              key={option.id}
              onClick={() => chooseOption(option.id)}
              className={`rounded border p-3 text-left transition-colors ${
                active ? "border-gold/70 bg-gold/10" : "border-border bg-deep hover:border-border-bright hover:bg-elevated/60"
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-black text-text-primary">{option.label}</div>
                  <div className="mt-1 text-xs text-text-muted">{option.description}</div>
                </div>
                <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${active ? "border-gold/40 text-gold" : "border-border text-text-muted"}`}>
                  {option.badge}
                </span>
              </div>

              <div className="mb-3 flex items-center gap-1.5">
                {option.core.map((itemId, index) => (
                  <span key={itemId} className="flex items-center gap-2">
                    <InlineItem patch={patch} itemId={itemId} size="sm" />
                    {index < option.core.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-text-muted" />}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-border pt-2 text-xs">
                <div>
                  <div className="text-text-muted">Pick</div>
                  <div className="font-mono font-bold text-text-primary">{option.pickRate.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-text-muted">Win</div>
                  <div className="font-mono font-bold text-win">{option.winRate.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-text-muted">Jogos</div>
                  <div className="font-mono font-bold text-text-primary">{option.games.toLocaleString("pt-BR")}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="blitz-card-soft rounded p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-text-primary">Sua build montada</h3>
              <p className="text-xs text-text-muted">Itens iniciais, botas e caminho principal selecionado.</p>
            </div>
            <button
              onClick={() => setCustomItems([])}
              className="inline-flex items-center gap-1.5 rounded border border-border px-2 py-1 text-xs text-text-secondary transition-colors hover:border-border-bright hover:text-text-primary"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Limpar
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">Comece com</div>
              <div className="flex flex-wrap gap-2">
                {selected.starting.map((itemId, index) => (
                  <InlineItem key={`${itemId}-${index}`} patch={patch} itemId={itemId} />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">Itemizacao principal</div>
              <div className="flex flex-wrap items-center gap-2">
                {finalItems.map((itemId, index) => (
                  <span key={`${itemId}-${index}`} className="flex items-center gap-2">
                    <InlineItem patch={patch} itemId={itemId} size="lg" />
                    {index < finalItems.length - 1 && <ChevronRight className="h-4 w-4 text-text-muted" />}
                  </span>
                ))}
                {customItems.length < 2 && (
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-border text-text-muted">
                    <Plus className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">Botas</div>
              <div className="flex flex-wrap gap-2">
                {selected.boots.map((itemId) => (
                  <InlineItem key={itemId} patch={patch} itemId={itemId} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="blitz-card-soft rounded p-4">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-gold" />
            <h3 className="text-sm font-black text-text-primary">Situacionais</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {selected.situational.map((itemId) => {
              const active = customItems.includes(itemId);

              return (
                <button
                  key={itemId}
                  onClick={() => toggleSituational(itemId)}
                  className={`flex items-center justify-between rounded-lg border p-2 transition-colors ${
                    active ? "border-gold bg-gold/10" : "border-border bg-surface/50 hover:border-border-bright"
                  }`}
                >
                  <InlineItem patch={patch} itemId={itemId} size="sm" />
                  {active ? <Check className="h-4 w-4 text-gold" /> : <Plus className="h-4 w-4 text-text-muted" />}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-text-muted">
            Escolha ate dois itens para adaptar contra burst, controle, cura ou frontline.
          </p>
        </div>
      </div>
    </div>
  );
}

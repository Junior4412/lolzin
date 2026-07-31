import Link from "next/link";
import { cdnChampionSquare, getTierColor, getTierBg } from "@/lib/utils";
import type { ChampionMeta } from "@/types";

interface ChampionCardProps {
  champion: ChampionMeta;
  patch: string;
}

export function ChampionCard({ champion, patch }: ChampionCardProps) {
  const imageUrl = cdnChampionSquare(patch, champion.id);

  return (
    <Link href={`/campeoes/${champion.id}`}>
      <div className="group relative overflow-hidden rounded-lg bg-surface border border-border hover:border-gold/50 transition-all duration-300 shadow-card hover:shadow-card-hover h-full flex flex-col cursor-pointer">
        
        {/* Tier Badge */}
        <div className={`absolute top-2 right-2 z-10 px-2 py-0.5 rounded text-xs font-bold font-mono border backdrop-blur-md ${getTierBg(champion.tier)} ${getTierColor(champion.tier)}`}>
          {champion.tier}
        </div>

        {/* Image & Gradient */}
        <div className="relative aspect-square overflow-hidden bg-elevated">
          <img
            src={imageUrl}
            alt={champion.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative p-4 pt-1 flex-1 flex flex-col justify-end -mt-8 z-10">
          <h3 className="font-display text-xl font-bold text-text-primary group-hover:text-gold transition-colors truncate">
            {champion.name}
          </h3>
          
          <div className="flex items-center gap-2 mt-2">
            {champion.roles.map((role) => (
              <span key={role} className="text-xs text-text-muted capitalize">
                {role}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 text-xs font-mono">
            <div className="flex flex-col">
              <span className="text-text-muted">Win</span>
              <span className="text-win font-semibold">{(champion.winRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-text-muted">Pick</span>
              <span className="text-text-primary font-semibold">{(champion.pickRate * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

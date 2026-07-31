import { cn } from "@/lib/utils";
import * as React from "react";

// ---- Skeleton ----
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded bg-gradient-to-r from-surface via-elevated to-surface bg-[length:1000px_100%]",
        className
      )}
      {...props}
    />
  );
}

// ---- Badge ----
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "arcane" | "win" | "loss" | "warn" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold tracking-wide",
        {
          "bg-surface text-text-secondary border border-border": variant === "default",
          "bg-gold/15 text-gold border border-gold/30": variant === "gold",
          "bg-arcane-bright/15 text-arcane-bright border border-arcane-bright/30": variant === "arcane",
          "bg-win/15 text-win border border-win/30": variant === "win",
          "bg-loss/15 text-loss border border-loss/30": variant === "loss",
          "bg-warn/15 text-warn border border-warn/30": variant === "warn",
          "border border-border text-text-secondary bg-transparent": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

// ---- Card ----
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hover?: boolean;
}

export function Card({ className, glow, hover = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-lg shadow-card",
        hover && "transition-all duration-300 hover:border-border-bright hover:shadow-card-hover",
        glow && "shadow-gold",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pb-0", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pt-0", className)} {...props} />;
}

// ---- Button ----
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold rounded transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none",
        {
          // Variants
          "bg-arcane text-white hover:bg-arcane/80 border border-arcane/50": variant === "primary",
          "bg-gold-gradient text-void font-bold hover:brightness-110 shadow-gold-sm": variant === "gold",
          "bg-transparent text-text-secondary hover:text-text-primary hover:bg-elevated": variant === "ghost",
          "border border-border text-text-primary hover:border-border-bright hover:bg-elevated": variant === "outline",
          "bg-loss/10 text-loss border border-loss/30 hover:bg-loss/20": variant === "destructive",
          // Sizes
          "px-2 py-1 text-xs": size === "sm",
          "px-4 py-2 text-sm": size === "md",
          "px-6 py-3 text-base": size === "lg",
          "w-8 h-8 p-0": size === "icon",
        },
        className
      )}
      {...props}
    />
  );
}

// ---- Divider ----
export function Divider({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("border-border", className)} {...props} />;
}

// ---- Section Header ----
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, badge, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="font-display text-xl font-bold text-text-primary tracking-wide">{title}</h2>
          {badge && <Badge variant="gold">{badge}</Badge>}
        </div>
        {subtitle && <p className="text-text-secondary text-sm">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ---- Spinner ----
export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-5 w-5 rounded-full border-2 border-border border-t-gold animate-spin",
        className
      )}
    />
  );
}

// ---- Stat Item ----
interface StatItemProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  className?: string;
}

export function StatItem({ label, value, sub, color = "text-text-primary", className }: StatItemProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-xs text-text-muted uppercase tracking-wider mb-0.5">{label}</span>
      <span className={cn("text-base font-bold font-mono", color)}>{value}</span>
      {sub && <span className="text-xs text-text-muted">{sub}</span>}
    </div>
  );
}

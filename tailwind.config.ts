import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        void: "#03060e",
        deep: "#070d1a",
        surface: "#0d1525",
        elevated: "#111d2e",
        border: "#1a2e4a",
        "border-bright": "#2a4a70",

        // Brand — Gold
        gold: {
          DEFAULT: "#C8A85A",
          bright: "#E5C46A",
          muted: "#8a6d2f",
          dim: "#4a3a18",
        },

        // Brand — Blue
        arcane: {
          DEFAULT: "#1A6EA8",
          bright: "#4FC3F7",
          dim: "#0d3654",
        },

        // Brand — Purple
        void_purple: {
          DEFAULT: "#6B3FA0",
          bright: "#9B59D0",
          dim: "#2d1a45",
        },

        // Semantic
        win: "#22c55e",
        loss: "#ef4444",
        warn: "#f97316",
        neutral: "#8B9CB3",

        // Text
        text: {
          primary: "#E8E4D9",
          secondary: "#8B9CB3",
          muted: "#4A5568",
          inverse: "#03060e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Cinzel", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C8A85A 0%, #8a6d2f 100%)",
        "arcane-gradient": "linear-gradient(135deg, #4FC3F7 0%, #1A6EA8 100%)",
        "void-gradient": "linear-gradient(180deg, #03060e 0%, #070d1a 100%)",
        "surface-gradient": "linear-gradient(135deg, #0d1525 0%, #111d2e 100%)",
        "hero-gradient":
          "radial-gradient(ellipse at 50% 0%, rgba(200,168,90,0.15) 0%, rgba(26,110,168,0.08) 40%, transparent 70%)",
        "card-shine":
          "linear-gradient(135deg, rgba(200,168,90,0.1) 0%, transparent 50%, rgba(79,195,247,0.05) 100%)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(200, 168, 90, 0.3)",
        "gold-sm": "0 0 8px rgba(200, 168, 90, 0.2)",
        arcane: "0 0 20px rgba(79, 195, 247, 0.3)",
        glow: "0 4px 30px rgba(200, 168, 90, 0.15), 0 1px 0 rgba(200, 168, 90, 0.1)",
        card: "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(200,168,90,0.1)",
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        pulse_gold: "pulseGold 3s infinite ease-in-out",
        float: "float 6s infinite ease-in-out",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "24px",
        "3xl": "32px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

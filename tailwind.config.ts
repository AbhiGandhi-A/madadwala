import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        accent: {
          DEFAULT: "#10B981",
          dark: "#059669",
        },
        dark: {
          DEFAULT: "#1F2937",
          900: "#111827",
          800: "#1F2937",
          700: "#374151",
        },
        bg: "#F8FAFC",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "count-up": "count-up 2s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245,158,11,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(245,158,11,0.8)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #F59E0B 0%, #F97316 30%, #EF4444 60%, #1F2937 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(16,185,129,0.05))",
        "shimmer-gradient": "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
      },
    },
  },
  plugins: [],
};

export default config;

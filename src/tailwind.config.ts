import type { Config } from "tailwindcss";
import twAnimateCss from "tw-animate-css";

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* 🎯 Paleta semántica usada por shadcn */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },

        /* 🎨 Paleta “brand” con escala 50–900 que ya habíamos definido */
        brand: {
          50: "#f1f6f1",
          100: "#dce8dc",
          200: "#c0d4c0",
          300: "#a4c0a4",
          400: "#8fb08f",
          500: "#80af80",
          600: "#679267",
          700: "#4f744f",
          800: "#395639",
          900: "#243924",
        },
        brandSecondary: {
          50: "#f3eeed",
          100: "#e4d8d4",
          200: "#c8afa9",
          300: "#ac877e",
          400: "#8f6053",
          500: "#4c2d22",
          600: "#40251c",
          700: "#331e17",
          800: "#251611",
          900: "#170e0b",
        },
        brandAccent: {
          50: "#fcf6eb",
          100: "#f8e8ce",
          200: "#f0cf99",
          300: "#e8b564",
          400: "#e0a14a",
          500: "#e4a542",
          600: "#bd8736",
          700: "#95692a",
          800: "#6d4b1e",
          900: "#452d12",
        },
        brandInfo: {
          50: "#f6f9fc",
          100: "#e9f0f8",
          200: "#d2e1f0",
          300: "#bcd1e7",
          400: "#a5c1df",
          500: "#c5daef",
          600: "#9bb0c4",
          700: "#758696",
          800: "#505c68",
          900: "#2b323b",
        },
        brandAlert: {
          50: "#fdf3f3",
          100: "#fbe3e3",
          200: "#f6c7c7",
          300: "#f0aaaa",
          400: "#ea8e8e",
          500: "#ed8383",
          600: "#c56c6c",
          700: "#9c5555",
          800: "#733e3e",
          900: "#4a2626",
        },
        brandBg: {
          soft: "#f5f9f2",
          muted: "#e4f0e4",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [twAnimateCss()],
};

export default config;

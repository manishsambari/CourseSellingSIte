/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          950: "#060609",
          900: "#0a0a0f",
          850: "#0f0f18",
          800: "#13131f",
          750: "#181827",
          700: "#1e1e30",
          600: "#2a2a40",
          500: "#3d3d5c",
        },
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        accent: {
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(124, 58, 237, 0.4)",
        "glow-lg": "0 0 45px -10px rgba(124, 58, 237, 0.5)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.4)",
        "card-dark": "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
      },
      animation: {
        "float": "floating 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        floating: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      }
    },
  },
  plugins: [],
};

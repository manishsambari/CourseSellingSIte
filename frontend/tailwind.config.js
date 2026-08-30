/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cyber: {
          950: "#04060a",
          900: "#080c14",
          850: "#0c121e",
          800: "#101726",
          750: "#162034",
          700: "#1c2a45",
          600: "#2a3d63",
          500: "#3d568a",
          400: "#6284c4",
        },
        neon: {
          cyan: "#00f0ff",
          lime: "#00ff9d",
          emerald: "#10b981",
          purple: "#9d4edd",
          indigo: "#6366f1",
          amber: "#ffb703",
          rose: "#ff0055",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', "sans-serif"],
        sans: ['"Plus Jakarta Sans"', '"Inter"', "sans-serif"],
        mono: ['"Space Mono"', '"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
      boxShadow: {
        "neon-cyan": "0 0 20px -3px rgba(0, 240, 255, 0.4)",
        "neon-purple": "0 0 20px -3px rgba(157, 78, 221, 0.4)",
        "neon-lime": "0 0 20px -3px rgba(0, 255, 157, 0.35)",
        "cyber-card": "0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 1px, transparent 1px)",
        "matrix-glow": "radial-gradient(ellipse at top, rgba(0, 240, 255, 0.12) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 80%)",
      },
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pruksa: {
          green: "#5BA730",
          gray: "#BBBDBF",
          orange: "#F15A29",
          yellow: "#EDBF4F",
          teal: "#296E6D",
          ink: "#1F2328"
        }
      },
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 35, 40, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;

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
        sans: [
          "var(--font-inter)",
          "var(--font-noto-thai)",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      fontSize: {
        xs:   ["0.75rem",  { lineHeight: "1.125rem", letterSpacing: "0.01em" }],
        sm:   ["0.8125rem",{ lineHeight: "1.25rem",  letterSpacing: "0.005em" }],
        base: ["0.9375rem",{ lineHeight: "1.5rem",   letterSpacing: "0" }],
        lg:   ["1.0625rem",{ lineHeight: "1.625rem", letterSpacing: "-0.005em" }],
        xl:   ["1.25rem",  { lineHeight: "1.75rem",  letterSpacing: "-0.01em" }],
        "2xl":["1.5rem",   { lineHeight: "2rem",     letterSpacing: "-0.015em" }],
        "3xl":["1.875rem", { lineHeight: "2.25rem",  letterSpacing: "-0.02em" }],
        "4xl":["2.25rem",  { lineHeight: "2.625rem", letterSpacing: "-0.025em" }],
        "5xl":["3rem",     { lineHeight: "3.25rem",  letterSpacing: "-0.03em" }],
        "6xl":["3.75rem",  { lineHeight: "4rem",     letterSpacing: "-0.035em" }],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 35, 40, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;

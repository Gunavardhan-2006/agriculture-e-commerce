import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: { fontFamily: { sans: ["var(--font-inter)"], mono: ["var(--font-jetbrains-mono)"], display: ["var(--font-google-sans-code)", "var(--font-jetbrains-mono)"] } } },
} satisfies Config;

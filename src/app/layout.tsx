import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgriLink | Farm to market",
  description: "Direct farm marketplace and delivery coordination",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full bg-stone-50 font-[family-name:var(--font-inter)] text-slate-900 dark:bg-black dark:text-stone-100">{children}</body>
    </html>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Bug,
  CloudRain,
  CloudSun,
  Droplets,
  Landmark,
  Leaf,
  Package,
  Search,
  Sprout,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  ARTICLE_CATEGORIES,
  ARTICLE_LANGUAGES,
  allArticles,
  t,
  type Article,
  type ArticleLang,
} from "@/lib/articles";
import { useLanguage } from "@/components/shared/LanguageProvider";
import type { LanguageCode } from "@/lib/i18n";

const ICONS: Record<Article["icon"], typeof CloudSun> = {
  sun: CloudSun,
  drop: Droplets,
  book: BookOpen,
  soil: Sprout,
  pest: Bug,
  store: Package,
  rain: CloudRain,
  scheme: Landmark,
  leaf: Leaf,
};

const HEADINGS: Record<string, { title: string; intro: string }> = {
  en: {
    title: "Agriculture field notes",
    intro:
      "Practical market, crop, and weather guidance for producers and buyers. Open any article to read the full guide.",
  },
  hi: {
    title: "कृषि जानकारी",
    intro: "किसानों और खरीदारों के लिए बाजार, फसल और मौसम की व्यावहारिक सलाह। पूरा लेख पढ़ने के लिए खोलें।",
  },
  te: {
    title: "వ్యవసాయ సమాచారం",
    intro: "రైతులు, కొనుగోలుదారుల కోసం మార్కెట్, పంట, వాతావరణ సలహాలు. పూర్తి గైడ్ కోసం ఏ వ్యాసమైనా తెరవండి.",
  },
  ta: {
    title: "வேளாண் குறிப்புகள்",
    intro: "உற்பத்தியாளர், வாங்குபவர்களுக்கான சந்தை, பயிர், வானிலை வழிகாட்டுதல். முழு வழிகாட்டிக்கு எந்தக் கட்டுரையையும் திறவுங்கள்.",
  },
  kn: {
    title: "ಕೃಷಿ ಟಿಪ್ಪಣಿಗಳು",
    intro: "ಉತ್ಪಾದಕರು, ಖರೀದಿದಾರರಿಗೆ ಮಾರುಕಟ್ಟೆ, ಬೆಳೆ, ಹವಾಮಾನ ಮಾರ್ಗದರ್ಶನ. ಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿಗೆ ಯಾವುದೇ ಲೇಖನ ತೆರೆಯಿರಿ.",
  },
  mr: {
    title: "कृषी नोंदी",
    intro: "उत्पादक व खरेदीदारांसाठी बाजार, पीक, हवामान मार्गदर्शन. संपूर्ण मार्गदर्शकासाठी कोणताही लेख उघडा.",
  },
};

export function AgricultureArticles() {
  const { language: globalLang } = useLanguage();
  const [override, setOverride] = useState<ArticleLang | null>(null);
  const language: ArticleLang = override ?? (globalLang as ArticleLang);
  const setLanguage = (code: ArticleLang) => setOverride(code);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [articles, setArticles] = useState<Article[]>(() => allArticles());

  // Re-read localStorage custom (admin-uploaded) articles when they change elsewhere.
  useEffect(() => {
    const refresh = () => setArticles(allArticles());
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const heading = HEADINGS[language] ?? HEADINGS.en;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (category !== "All" && a.category !== category) return false;
      if (!q) return true;
      const tr = t(a, language);
      return (
        tr.title.toLowerCase().includes(q) ||
        tr.excerpt.toLowerCase().includes(q) ||
        a.slug.includes(q)
      );
    });
  }, [articles, category, query, language]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
        Knowledge hub
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold">{heading.title}</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-neutral-300">{heading.intro}</p>
        </div>
        <div className="flex flex-wrap rounded-lg border border-stone-300 p-1 dark:border-neutral-700">
          {ARTICLE_LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`rounded px-3 py-2 text-sm font-bold ${
                code === language
                  ? "bg-emerald-700 text-white"
                  : "text-slate-600 dark:text-neutral-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <label className="flex min-w-52 flex-1 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950">
          <Search size={16} className="shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="w-full bg-transparent outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {["All", ...ARTICLE_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                c === category
                  ? "bg-emerald-700 text-white"
                  : "bg-stone-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 font-mono text-xs text-slate-500 dark:text-neutral-400">
        {filtered.length} of {articles.length} articles · {language.toUpperCase()} · click any card to open
      </p>

      {filtered.length === 0 ? (
        <Card className="mt-6 p-8 text-center">
          <p className="font-display text-xl font-bold">No articles match</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-neutral-300">
            Try a different search or category. New articles are published by the admin team.
          </p>
        </Card>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {filtered.map((article) => {
            const tr = t(article, language);
            const Icon = ICONS[article.icon] ?? BookOpen;
            return (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}?lang=${language}`}
                className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <Card className="flex h-full flex-col p-5 transition group-hover:border-emerald-300 group-hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <Icon className="text-emerald-700 dark:text-emerald-400" />
                    <span className="rounded-full bg-emerald-50 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-xl font-bold group-hover:underline">
                    {tr.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                    {tr.excerpt}
                  </p>
                  <p className="mt-4 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-neutral-400">
                      {article.readMins} min read{article.custom ? " · Admin" : ""}
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400">
                      Read →
                    </span>
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <p className="mt-8 rounded-lg bg-stone-100 p-4 text-xs leading-5 text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
        Publishing is restricted to admins. To add or edit an article, sign in as{" "}
        <span className="font-mono font-bold">admin@agrilink.demo</span> and use the
        Article manager on the Admin page. Articles requested in other languages are
        translated before publishing so every guide is available in English, Hindi,
        Telugu, Tamil, Kannada, and Marathi.
      </p>
    </main>
  );
}

export type { LanguageCode };

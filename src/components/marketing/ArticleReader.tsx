"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Bug,
  CloudRain,
  CloudSun,
  Droplets,
  Landmark,
  Leaf,
  Package,
  Sprout,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  ARTICLE_LANGUAGES,
  allArticles,
  findArticle,
  t,
  type Article,
  type ArticleLang,
} from "@/lib/articles";
import { useLanguage } from "@/components/shared/LanguageProvider";

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

function isArticleLang(v: string | null): v is ArticleLang {
  return ARTICLE_LANGUAGES.some((l) => l.code === v);
}

export function ArticleReader() {
  const params = useParams<{ slug: string }>();
  const search = useSearchParams();
  const { language: globalLang } = useLanguage();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const queryLang = search.get("lang");
  const [override, setOverride] = useState<ArticleLang | null>(null);
  const language: ArticleLang = override ?? (isArticleLang(queryLang) ? queryLang : ((globalLang as ArticleLang) ?? "en"));
  const setLanguage = (code: ArticleLang) => setOverride(code);
  const [articles, setArticles] = useState<Article[]>(() => allArticles());

  useEffect(() => {
    const refresh = () => setArticles(allArticles());
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const article = useMemo(() => articles.find((a) => a.slug === slug) ?? findArticle(slug), [articles, slug]);

  const related = useMemo(() => {
    const all = articles.filter((a) => a.slug !== slug);
    const sameCat = all.filter((a) => article && a.category === article.category);
    const rest = all.filter((a) => !article || a.category !== article.category);
    return [...sameCat, ...rest].slice(0, 3);
  }, [slug, article, articles]);

  if (!article) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Card className="p-8 text-center">
          <p className="font-display text-2xl font-bold">Article not found</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-neutral-300">
            It may have been removed by the admin. Browse the knowledge hub for other
            guides.
          </p>
          <Link
            href="/articles"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white"
          >
            <ArrowLeft size={16} /> Back to articles
          </Link>
        </Card>
      </main>
    );
  }

  const tr = t(article, language);
  const Icon = ICONS[article.icon] ?? BookOpen;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400"
      >
        <ArrowLeft size={16} /> All articles
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-700 text-white">
          <Icon size={20} />
        </span>
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {article.category} · {article.readMins} min read · Updated {article.updated}
            {article.custom ? " · Published by admin" : ""}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold">{tr.title}</h1>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1 rounded-lg border border-stone-300 p-1 dark:border-neutral-700">
        {ARTICLE_LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            className={`rounded px-3 py-1.5 text-xs font-bold ${
              code === language
                ? "bg-emerald-700 text-white"
                : "text-slate-600 dark:text-neutral-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mt-4 border-l-4 border-emerald-600 pl-4 text-base font-semibold leading-7 text-slate-700 dark:text-neutral-200">
        {tr.excerpt}
      </p>

      <div className="mt-6 space-y-5">
        {tr.body.map((para, i) => (
          <p key={i} className="text-[15px] leading-7 text-slate-700 dark:text-neutral-200">
            {para}
          </p>
        ))}
      </div>

      <Card className="mt-8 p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Apply this on AgriLink
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
          Turn this guide into action: check today&apos;s market board for graded lots,
          compare the regional baseline price, and list your own harvest with a clear
          photo and harvest date.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/marketplace"
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white"
          >
            Browse marketplace
          </Link>
          <Link
            href="/articles"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-bold dark:border-neutral-700"
          >
            More guides
          </Link>
        </div>
      </Card>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">Keep reading</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((r) => {
              const rtr = t(r, language);
              const RIcon = ICONS[r.icon] ?? BookOpen;
              return (
                <Link key={r.slug} href={`/articles/${r.slug}?lang=${language}`} className="group">
                  <Card className="h-full p-4 group-hover:shadow-md">
                    <RIcon size={18} className="text-emerald-700 dark:text-emerald-400" />
                    <p className="mt-3 text-sm font-bold leading-5 group-hover:underline">
                      {rtr.title}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-slate-500">
                      {r.category} · {r.readMins} min
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

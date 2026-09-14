"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PencilLine, ShieldCheck, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  ADMIN_EMAIL,
  ARTICLE_CATEGORIES,
  ARTICLE_LANGUAGES,
  allArticles,
  deleteCustomArticle,
  isAdminEmail,
  saveCustomArticle,
  slugify,
  t,
  type Article,
  type ArticleLang,
} from "@/lib/articles";

type FormState = Record<ArticleLang, { title: string; excerpt: string; body: string }>;

const emptyForm = (): FormState => ({
  en: { title: "", excerpt: "", body: "" },
  hi: { title: "", excerpt: "", body: "" },
  te: { title: "", excerpt: "", body: "" },
  ta: { title: "", excerpt: "", body: "" },
  kn: { title: "", excerpt: "", body: "" },
  mr: { title: "", excerpt: "", body: "" },
});

function readIsAdmin(): boolean {
  try {
    return isAdminEmail(window.localStorage.getItem("agrilink-demo-user"));
  } catch {
    return false;
  }
}

export function ArticleManager() {
  const [isAdmin, setIsAdmin] = useState<boolean>(() =>
    typeof window === "undefined" ? false : readIsAdmin(),
  );
  const [articles, setArticles] = useState<Article[]>(() =>
    typeof window === "undefined" ? [] : allArticles(),
  );
  const [formLang, setFormLang] = useState<ArticleLang>("en");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [category, setCategory] = useState<string>("Market");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  // Keep the admin gate + list fresh if login or articles change in another tab.
  useEffect(() => {
    const refresh = () => {
      setIsAdmin(readIsAdmin());
      setArticles(allArticles());
    };
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const custom = articles.filter((a) => a.custom);

  // Hard gate: only the admin account can even see the upload form.
  if (!isAdmin) {
    return (
      <Card className="mt-6 p-5">
        <p className="flex items-center gap-2 font-display text-lg font-bold">
          <ShieldCheck size={18} className="text-emerald-700" /> Article publishing is admin-only
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-neutral-300">
          Sign in as <span className="font-mono font-bold">{ADMIN_EMAIL}</span> to upload,
          edit, or remove knowledge-hub articles. Readers can open every article in all 6
          languages without signing in.
        </p>
      </Card>
    );
  }

  const set = (field: keyof FormState["en"], value: string) =>
    setForm((f) => ({ ...f, [formLang]: { ...f[formLang], [field]: value } }));

  const copyEnglishToAll = () => {
    setForm((f) => {
      const next = { ...f };
      (Object.keys(next) as ArticleLang[]).forEach((lang) => {
        if (lang === "en") return;
        if (!next[lang].title && !next[lang].excerpt && !next[lang].body) {
          next[lang] = { ...f.en };
        }
      });
      return next;
    });
    setSaved("English draft copied to empty languages — please translate before publishing.");
  };

  const publish = () => {
    setError("");
    setSaved("");
    if (!form.en.title.trim() || !form.en.excerpt.trim() || !form.en.body.trim()) {
      setError("English title, excerpt, and body are required (one paragraph per line).");
      return;
    }
    const slug = slugify(form.en.title);
    if (articles.some((a) => a.slug === slug)) {
      setError(`An article with URL “${slug}” already exists. Change the English title.`);
      return;
    }
    const article: Article = {
      slug,
      category,
      readMins: Math.max(2, Math.round(form.en.body.split(/\s+/).length / 180)),
      updated: new Date().toISOString().slice(0, 10),
      icon: "book",
      custom: true,
      translations: {
        en: {
          title: form.en.title.trim(),
          excerpt: form.en.excerpt.trim(),
          body: form.en.body.split("\n").map((s) => s.trim()).filter(Boolean),
        },
        hi: {
          title: form.hi.title.trim() || form.en.title.trim(),
          excerpt: form.hi.excerpt.trim() || form.en.excerpt.trim(),
          body: form.hi.body.trim()
            ? form.hi.body.split("\n").map((s) => s.trim()).filter(Boolean)
            : form.en.body.split("\n").map((s) => s.trim()).filter(Boolean),
        },
        te: {
          title: form.te.title.trim() || form.en.title.trim(),
          excerpt: form.te.excerpt.trim() || form.en.excerpt.trim(),
          body: form.te.body.trim()
            ? form.te.body.split("\n").map((s) => s.trim()).filter(Boolean)
            : form.en.body.split("\n").map((s) => s.trim()).filter(Boolean),
        },
        ta: {
          title: form.ta.title.trim() || form.en.title.trim(),
          excerpt: form.ta.excerpt.trim() || form.en.excerpt.trim(),
          body: form.ta.body.trim()
            ? form.ta.body.split("\n").map((s) => s.trim()).filter(Boolean)
            : form.en.body.split("\n").map((s) => s.trim()).filter(Boolean),
        },
        kn: {
          title: form.kn.title.trim() || form.en.title.trim(),
          excerpt: form.kn.excerpt.trim() || form.en.excerpt.trim(),
          body: form.kn.body.trim()
            ? form.kn.body.split("\n").map((s) => s.trim()).filter(Boolean)
            : form.en.body.split("\n").map((s) => s.trim()).filter(Boolean),
        },
        mr: {
          title: form.mr.title.trim() || form.en.title.trim(),
          excerpt: form.mr.excerpt.trim() || form.en.excerpt.trim(),
          body: form.mr.body.trim()
            ? form.mr.body.split("\n").map((s) => s.trim()).filter(Boolean)
            : form.en.body.split("\n").map((s) => s.trim()).filter(Boolean),
        },
      },
    };
    saveCustomArticle(article);
    setForm(emptyForm());
    setCategory("Market");
    setArticles(allArticles());
    setSaved(`Published “${article.translations.en.title}” in all 6 languages → /articles/${slug}`);
  };

  const remove = (slug: string) => {
    deleteCustomArticle(slug);
    setArticles(allArticles());
  };

  const cur = form[formLang];

  return (
    <section>
      <Card className="p-5">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <ShieldCheck size={14} /> Admin only · Article manager
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold">Publish a knowledge-hub article</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-neutral-300">
          {articles.length} live articles ({custom.length} admin-uploaded) · every article must
          ship in English, Hindi, Telugu, Tamil, Kannada, and Marathi. Fill English first, then
          switch language tabs.
        </p>

        <div className="mt-4 flex flex-wrap gap-1 rounded-lg border border-stone-300 p-1 dark:border-neutral-700">
          {ARTICLE_LANGUAGES.map(({ code, label }) => {
            const done = form[code].title.trim() && form[code].body.trim();
            return (
              <button
                key={code}
                onClick={() => setFormLang(code)}
                className={`rounded px-3 py-1.5 text-xs font-bold ${
                  code === formLang
                    ? "bg-emerald-700 text-white"
                    : done
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                      : "text-slate-600 dark:text-neutral-300"
                }`}
              >
                {label}
                {done ? " ✓" : ""}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3">
          <div className="flex flex-wrap gap-2">
            <label className="text-xs font-bold">
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="ml-2 rounded-lg border border-slate-300 p-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
              >
                {ARTICLE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <Button variant="outline" onClick={copyEnglishToAll}>
              Copy English to empty languages
            </Button>
          </div>
          <input
            value={cur.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder={`Title (${formLang.toUpperCase()})`}
            className="rounded-lg border border-slate-300 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
          />
          <input
            value={cur.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            placeholder={`One-line summary (${formLang.toUpperCase()})`}
            className="rounded-lg border border-slate-300 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
          />
          <textarea
            value={cur.body}
            onChange={(e) => set("body", e.target.value)}
            placeholder={`Body (${formLang.toUpperCase()}) — one paragraph per line, 3–5 paragraphs`}
            rows={6}
            className="rounded-lg border border-slate-300 p-3 text-sm leading-6 dark:border-neutral-700 dark:bg-neutral-950"
          />
          {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {saved && (
            <p className="rounded bg-emerald-50 p-3 text-sm text-emerald-800">{saved}</p>
          )}
          <div>
            <Button onClick={publish}>
              <PencilLine size={16} /> Publish in all 6 languages
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-4 space-y-3">
        {articles.map((a) => (
          <Card key={a.slug} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
                {a.category} · /articles/{a.slug} {a.custom ? "· admin-uploaded" : "· built-in"}
              </p>
              <p className="truncate font-bold">{t(a, "en").title}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/articles/${a.slug}`}
                className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-bold dark:border-neutral-700"
              >
                Open
              </Link>
              {a.custom && (
                <Button variant="danger" onClick={() => remove(a.slug)}>
                  <Trash2 size={14} /> Delete
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

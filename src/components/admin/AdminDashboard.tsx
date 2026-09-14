"use client";
import { useState } from "react";
import { BookOpenText, Store } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SellerModeration } from "@/components/admin/SellerModeration";
import { ArticleManager } from "@/components/admin/ArticleManager";
import { listings } from "@/lib/demo-data";
import { ARTICLES } from "@/lib/articles";

const sellerCount = new Set(listings.map((l) => l.farmer)).size;
const priceAlerts = listings.filter((l) => l.price > l.suggested * 1.08).length;

type Tab = "sellers" | "articles";

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("sellers");

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
        Restricted · Admin control
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold">Admin control centre</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-neutral-300">
        Moderate sellers and their prices, or publish knowledge-hub articles. Article
        publishing is admin-only — readers never see upload controls.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-4">
        {[
          ["Sellers", String(sellerCount)],
          ["Live listings", String(listings.length)],
          ["Price alerts", String(priceAlerts)],
          ["Knowledge guides", String(ARTICLES.length)],
        ].map(([label, value]) => (
          <Card key={label} className="p-5">
            <p className="font-mono text-2xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-neutral-300">{label}</p>
          </Card>
        ))}
      </div>

      {/* Section tabs: sellers vs blog writing */}
      <div className="mt-7 flex gap-1 rounded-xl border border-stone-300 p-1 dark:border-neutral-700">
        <button
          onClick={() => setTab("sellers")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold ${
            tab === "sellers"
              ? "bg-emerald-700 text-white"
              : "text-slate-600 dark:text-neutral-300"
          }`}
        >
          <Store size={16} /> Sellers & prices
        </button>
        <button
          onClick={() => setTab("articles")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold ${
            tab === "articles"
              ? "bg-emerald-700 text-white"
              : "text-slate-600 dark:text-neutral-300"
          }`}
        >
          <BookOpenText size={16} /> Blog & articles
        </button>
      </div>

      {tab === "sellers" ? (
        <section>
          <p className="mt-6 text-sm text-slate-600 dark:text-neutral-300">
            Click any seller to see everything they sell, at what price, versus the
            regional baseline — then warn, suspend, or unsuspend.
          </p>
          <SellerModeration />
        </section>
      ) : (
        <section className="mt-6">
          <ArticleManager />
        </section>
      )}
    </main>
  );
}

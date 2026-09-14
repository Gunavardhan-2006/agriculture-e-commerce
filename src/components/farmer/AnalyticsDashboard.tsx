"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Sprout, Store, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatQuantity } from "@/lib/utils";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { useListings } from "@/lib/useListings";
import {
  categoryStats,
  isPaddy,
  isVegetable,
  stockValue,
  topByValue,
  totalStockValue,
} from "@/lib/analytics";

const BAR_COLORS = [
  "bg-emerald-600",
  "bg-amber-500",
  "bg-sky-600",
  "bg-orange-500",
  "bg-violet-500",
  "bg-stone-400",
];

export function AnalyticsDashboard() {
  const { t } = useLanguage();
  const { listings } = useListings();

  const stats = useMemo(() => {
    const total = totalStockValue(listings);
    const paddy = listings.filter(isPaddy);
    const veg = listings.filter(isVegetable);
    const paddyValue = totalStockValue(paddy);
    const vegValue = totalStockValue(veg);
    const safe = total || 1;
    return {
      total,
      paddyValue,
      vegValue,
      paddyShare: paddyValue / safe,
      vegShare: vegValue / safe,
      restShare: Math.max(0, 1 - (paddyValue + vegValue) / safe),
      byCategory: categoryStats(listings),
      top: topByValue(listings, 6),
    };
  }, [listings]);

  const donut = `conic-gradient(#059669 0 ${(stats.paddyShare * 100).toFixed(1)}%, #f59e0b ${(stats.paddyShare * 100).toFixed(1)}% ${((stats.paddyShare + stats.vegShare) * 100).toFixed(1)}%, #e7e5e4 ${((stats.paddyShare + stats.vegShare) * 100).toFixed(1)}% 100%)`;

  const cards = [
    {
      Icon: Wallet,
      label: t("Total stock value"),
      value: formatCurrency(stats.total),
      sub: `${listings.length} · ${t("Active listings").toLowerCase()}`,
    },
    {
      Icon: Sprout,
      label: t("Paddy stock value"),
      value: formatCurrency(stats.paddyValue),
      sub: `${Math.round(stats.paddyShare * 100)}% ${t("Share of total stock")}`,
    },
    {
      Icon: Store,
      label: t("Vegetables stock value"),
      value: formatCurrency(stats.vegValue),
      sub: `${Math.round(stats.vegShare * 100)}% ${t("Share of total stock")}`,
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
        {t("Analytics")}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold">
        {t("Stock value overview")}
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-neutral-300">
        {t("Live market data across every visible listing.")}
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ Icon, label, value, sub }) => (
          <Card key={label} className="p-5">
            <Icon className="text-emerald-700 dark:text-emerald-400" size={20} />
            <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-neutral-300">
              {label}
            </p>
            <p className="mt-1 font-mono text-2xl font-bold">{value}</p>
            <p className="mt-1 font-mono text-xs text-slate-500 dark:text-neutral-400">
              {sub}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <Card className="p-5">
          <h2 className="font-display text-xl font-bold">
            {t("Paddy vs vegetables")}
          </h2>
          <div className="mt-5 flex items-center gap-5">
            <div className="relative h-36 w-36 shrink-0">
              <div
                className="h-full w-full rounded-full"
                style={{ background: donut }}
                role="img"
                aria-label={t("Paddy vs vegetables")}
              />
              <div className="absolute inset-4 grid place-items-center rounded-full bg-white dark:bg-neutral-900">
                <div className="text-center">
                  <p className="font-mono text-sm font-bold">
                    {formatCurrency(stats.total)}
                  </p>
                  <p className="font-mono text-[10px] text-slate-500 dark:text-neutral-400">
                    {t("Total")}
                  </p>
                </div>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-emerald-600" />
                <span className="font-semibold">{t("Paddy stock value")}</span>
                <span className="font-mono text-slate-500 dark:text-neutral-400">
                  {Math.round(stats.paddyShare * 100)}%
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-amber-500" />
                <span className="font-semibold">
                  {t("Vegetables stock value")}
                </span>
                <span className="font-mono text-slate-500 dark:text-neutral-400">
                  {Math.round(stats.vegShare * 100)}%
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-stone-300 dark:bg-neutral-700" />
                <span className="font-semibold">{t("Other produce")}</span>
                <span className="font-mono text-slate-500 dark:text-neutral-400">
                  {Math.round(stats.restShare * 100)}%
                </span>
              </li>
            </ul>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-xl font-bold">
            {t("Stock value by category")}
          </h2>
          <ul className="mt-5 space-y-4">
            {stats.byCategory.map((c, i) => (
              <li key={c.category}>
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-semibold">
                    {t(c.category)} · {c.listings}
                  </span>
                  <span className="font-mono font-bold">
                    {formatCurrency(c.value)}
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-stone-200 dark:bg-neutral-800">
                  <div
                    className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                    style={{ width: `${Math.max(2, c.share * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-5 overflow-hidden">
        <div className="border-b border-stone-200 p-5 dark:border-neutral-800">
          <h2 className="font-display text-xl font-bold">
            {t("Top listings by stock value")}
          </h2>
        </div>
        <div className="divide-y divide-stone-100 dark:divide-neutral-800">
          {stats.top.map((l) => (
            <Link
              key={l.id}
              href={`/marketplace/${l.id}`}
              className="flex items-center justify-between gap-3 p-4 transition hover:bg-stone-50 dark:hover:bg-neutral-800/50"
            >
              <div className="min-w-0">
                <p className="truncate font-bold">{l.variety}</p>
                <p className="mt-1 font-mono text-xs text-slate-500 dark:text-neutral-400">
                  {l.farmer} · {formatQuantity(l.quantity, l.unit)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-sm font-bold text-emerald-800 dark:text-emerald-400">
                  {formatCurrency(stockValue(l))}
                </p>
                <p className="mt-1 font-mono text-[11px] text-slate-500 dark:text-neutral-400">
                  {formatCurrency(l.price)}/{l.unit}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </main>
  );
}

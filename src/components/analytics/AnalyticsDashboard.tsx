"use client";

import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp, Wheat, Boxes } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { listings } from "@/lib/demo-data";
import {
  DEFAULT_TREND_IDS,
  SERIES_COLORS,
  FEATURED_CROP_IDS,
  categoryPriceStats,
  cropTrend,
  featuredCrops,
  topMovers,
} from "@/lib/analytics";
import { CategoryBars, Legend, StockDonut, TrendChart } from "./charts";
import { formatCurrency } from "@/lib/utils";

const RANGES = [4, 8, 12];

function colorFor(id: string): string {
  const i = FEATURED_CROP_IDS.indexOf(id);
  return SERIES_COLORS[(i === -1 ? 0 : i) % SERIES_COLORS.length];
}

export function MarketPriceDashboard() {
  const [weeks, setWeeks] = useState(8);
  const [selected, setSelected] = useState<string[]>(DEFAULT_TREND_IDS);
  const crops = useMemo(() => featuredCrops(), []);

  const toggleCrop = (id: string) =>
    setSelected((cur) =>
      cur.includes(id) ? (cur.length > 1 ? cur.filter((c) => c !== id) : cur) : [...cur, id],
    );

  const trends = useMemo(() => selected.map((id) => {
    const listing = listings.find((l) => l.id === id)!;
    return { trend: cropTrend(listing, weeks), color: colorFor(id) };
  }), [selected, weeks]);

  const labels = useMemo(() => trends[0]?.trend.history.map((p) => p.label) ?? [], [trends]);

  const stats = useMemo(() => {
    const all = listings.map((l) => cropTrend(l, weeks));
    const paddy = all.filter((t) => t.id === "rice-01" || t.id === "rice-02");
    const riser = all.reduce((a, b) => (b.changePct > a.changePct ? b : a));
    const faller = all.reduce((a, b) => (b.changePct < a.changePct ? b : a));
    return {
      paddyAvg: paddy.reduce((s, t) => s + t.current, 0) / Math.max(1, paddy.length),
      riser,
      faller,
      volume: listings.reduce((s, l) => s + l.quantity, 0),
    };
  }, [weeks]);

  const cats = useMemo(() => categoryPriceStats(), []);
  const movers = useMemo(() => topMovers(8), []);
  const maxMover = Math.max(...movers.map((m) => Math.abs(m.gapPct)), 1);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
        Market intelligence
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Price analytics
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-neutral-300">
            Weekly mandi price movements for paddy and every other marketplace crop —
            listed price versus the regional baseline.
          </p>
        </div>
        <div className="flex rounded-lg border border-stone-300 p-1 dark:border-neutral-700">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setWeeks(r)}
              className={`rounded px-3 py-1.5 text-xs font-bold ${weeks === r ? "bg-emerald-700 text-white" : "text-slate-600 dark:text-neutral-300"}`}
            >
              {r} wks
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-slate-500 dark:text-neutral-400">
            <Wheat size={14} /> Paddy avg (2 lots)
          </p>
          <p className="mt-2 font-mono text-2xl font-bold">{formatCurrency(Math.round(stats.paddyAvg))}/kg</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">Sona Masoori + Basmati</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-slate-500 dark:text-neutral-400">
            <TrendingUp size={14} /> Biggest riser · {weeks}w
          </p>
          <p className="mt-2 font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            +{stats.riser.changePct}%
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">{stats.riser.variety}</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-slate-500 dark:text-neutral-400">
            <TrendingDown size={14} /> Biggest faller · {weeks}w
          </p>
          <p className="mt-2 font-mono text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.faller.changePct}%
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">{stats.faller.variety}</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-slate-500 dark:text-neutral-400">
            <Boxes size={14} /> Listed volume
          </p>
          <p className="mt-2 font-mono text-2xl font-bold">{stats.volume.toLocaleString("en-IN")} kg</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">{listings.length} live lots</p>
        </Card>
      </div>

      {/* Trend chart */}
      <Card className="mt-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold">Price trends · ₹/kg</h2>
          <Legend items={trends.map((t) => ({ name: t.trend.variety, color: t.color }))} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {crops.map((c) => {
            const on = selected.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCrop(c.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold ${on ? "border-emerald-700 bg-emerald-700 text-white" : "border-stone-300 text-slate-600 dark:border-neutral-700 dark:text-neutral-300"}`}
              >
                {c.variety}
              </button>
            );
          })}
        </div>
        <div className="mt-4">
          <TrendChart
            series={trends.map((t) => ({ name: t.trend.variety, color: t.color, values: t.trend.history.map((p) => p.price) }))}
            labels={labels}
            unit="kg"
          />
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Category averages */}
        <Card className="p-5">
          <h2 className="font-display text-xl font-bold">Category averages · ₹/kg</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">Listed vs regional baseline</p>
          <div className="mt-4">
            <CategoryBars groups={cats.map((c) => ({ label: c.category, listed: c.avgPrice, baseline: c.avgBaseline }))} />
          </div>
        </Card>
        {/* Stock share */}
        <Card className="p-5">
          <h2 className="font-display text-xl font-bold">Stock share by category</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">Listed quantity across the marketplace</p>
          <div className="mt-4">
            <StockDonut
              slices={cats.map((c, i) => ({ label: c.category, value: c.totalQty, color: SERIES_COLORS[i % SERIES_COLORS.length] }))}
              centerLabel={`${Math.round(cats.reduce((s, c) => s + c.totalQty, 0) / 1000)}k`}
            />
          </div>
        </Card>
      </div>

      {/* Movers */}
      <Card className="mt-4 p-5">
        <h2 className="font-display text-xl font-bold">Furthest from baseline</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">Listed price gap vs regional baseline — candidates for review</p>
        <div className="mt-4 space-y-2.5">
          {movers.map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <span className="w-44 shrink-0 truncate text-sm font-bold">{m.variety}</span>
              <div className="relative h-6 flex-1 overflow-hidden rounded bg-stone-100 dark:bg-neutral-800">
                <div className="absolute left-1/2 top-0 h-full w-px bg-stone-300 dark:bg-neutral-600" />
                <div
                  className={`absolute top-1 h-4 rounded ${m.gapPct >= 0 ? "bg-red-500" : "bg-emerald-600"}`}
                  style={
                    m.gapPct >= 0
                      ? { left: "50%", width: `${(m.gapPct / maxMover) * 50}%` }
                      : { right: "50%", width: `${(-m.gapPct / maxMover) * 50}%` }
                  }
                />
              </div>
              <span className={`w-20 shrink-0 text-right font-mono text-xs font-bold ${m.gapPct >= 0 ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                {m.gapPct > 0 ? `+${m.gapPct}%` : `${m.gapPct}%`}
              </span>
              <span className="hidden w-28 shrink-0 text-right font-mono text-xs text-slate-500 dark:text-neutral-400 sm:block">
                ₹{m.price} vs ₹{m.baseline}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Full price table */}
      <Card className="mt-4 overflow-hidden">
        <h2 className="p-5 pb-0 font-display text-xl font-bold">All marketplace prices</h2>
        <p className="px-5 pt-1 text-xs text-slate-500 dark:text-neutral-400">Current, baseline, {weeks}-week move and range</p>
        <div className="mt-3 max-h-96 overflow-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="sticky top-0 bg-stone-100 dark:bg-neutral-800">
              <tr className="font-mono text-[11px] uppercase tracking-wide text-slate-500 dark:text-neutral-400">
                <th className="px-4 py-2">Produce</th>
                <th className="px-4 py-2 text-right">Listed</th>
                <th className="px-4 py-2 text-right">Baseline</th>
                <th className="px-4 py-2 text-right">{weeks}w move</th>
                <th className="px-4 py-2 text-right">{weeks}w range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-neutral-800">
              {[...listings]
                .sort((a, b) => a.category.localeCompare(b.category) || a.variety.localeCompare(b.variety))
                .map((l) => {
                  const t = cropTrend(l, weeks);
                  return (
                    <tr key={l.id}>
                      <td className="px-4 py-2">
                        <span className="font-bold">{l.variety}</span>{" "}
                        <span className="font-mono text-[11px] text-slate-500 dark:text-neutral-400">{l.category}</span>
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-bold">{formatCurrency(l.price)}/{l.unit}</td>
                      <td className="px-4 py-2 text-right font-mono">{formatCurrency(l.suggested)}</td>
                      <td className={`px-4 py-2 text-right font-mono font-bold ${t.changePct >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                        {t.changePct > 0 ? `+${t.changePct}%` : `${t.changePct}%`}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-xs text-slate-500 dark:text-neutral-400">
                        ₹{t.min} – ₹{t.max}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-neutral-400">
        Weekly series are illustrative, seeded from each lot&apos;s live listed price and
        regional baseline so trends always end at today&apos;s market value.
      </p>
    </main>
  );
}

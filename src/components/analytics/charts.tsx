"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/utils";

export interface TrendSeries {
  name: string;
  color: string;
  values: number[];
}

const W = 720;
const H = 300;
const PAD = { l: 48, r: 14, t: 14, b: 30 };

function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const span = max - min;
  const raw = span / (count - 1);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 0.5; v += step) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

export function TrendChart({
  series,
  labels,
  unit,
}: {
  series: TrendSeries[];
  labels: string[];
  unit: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const n = labels.length;

  const { ticks, lo, hi } = useMemo(() => {
    const all = series.flatMap((s) => s.values);
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    const pad = (hi - lo || 1) * 0.15;
    const ticks = niceTicks(lo - pad, hi + pad);
    return { ticks, lo: ticks[0], hi: ticks[ticks.length - 1] };
  }, [series]);

  const x = (i: number) => PAD.l + (i / Math.max(1, n - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - lo) / (hi - lo || 1)) * (H - PAD.t - PAD.b);

  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = (e.target as SVGRectElement).getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, idx)));
  };

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="currentColor" className="text-stone-200 dark:text-neutral-800" strokeWidth={1} />
            <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" fontSize={11} className="fill-slate-500 dark:fill-neutral-400">
              ₹{t}
            </text>
          </g>
        ))}
        {labels.map((l, i) =>
          i % Math.ceil(n / 6) === 0 || i === n - 1 ? (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize={11} className="fill-slate-500 dark:fill-neutral-400">
              {l}
            </text>
          ) : null,
        )}
        {hover !== null && (
          <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="currentColor" className="text-stone-400 dark:text-neutral-600" strokeDasharray="4 3" />
        )}
        {series.map((s) => (
          <g key={s.name}>
            <polyline
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {hover !== null && (
              <circle cx={x(hover)} cy={y(s.values[hover])} r={4.5} fill={s.color} stroke="#fff" strokeWidth={2} />
            )}
            <circle cx={x(n - 1)} cy={y(s.values[n - 1])} r={3.5} fill={s.color} />
          </g>
        ))}
        <rect
          x={PAD.l}
          y={PAD.t}
          width={W - PAD.l - PAD.r}
          height={H - PAD.t - PAD.b}
          fill="transparent"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        />
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute z-10 min-w-40 rounded-lg border border-stone-200 bg-white p-2.5 text-xs shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
          style={{
            left: `min(max(${((x(hover) / W) * 100).toFixed(1)}%, 5rem), calc(100% - 11rem))`,
            top: "0.5rem",
          }}
        >
          <p className="font-mono font-bold">{labels[hover]}</p>
          {series.map((s) => (
            <p key={s.name} className="mt-1 flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                {s.name}
              </span>
              <span className="font-mono font-bold">
                {formatCurrency(s.values[hover])}/{unit}
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function Legend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {items.map((item) => (
        <span key={item.name} className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
          {item.name}
        </span>
      ))}
    </div>
  );
}

export function CategoryBars({
  groups,
}: {
  groups: { label: string; listed: number; baseline: number }[];
}) {
  const max = Math.max(...groups.flatMap((g) => [g.listed, g.baseline]));
  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="text-sm font-bold">{g.label}</p>
          {(
            [
              { name: "Listed", value: g.listed, cls: "bg-emerald-600" },
              { name: "Baseline", value: g.baseline, cls: "bg-stone-300 dark:bg-neutral-700" },
            ] as const
          ).map((row) => (
            <div key={row.name} className="mt-1.5 flex items-center gap-2">
              <span className="w-14 shrink-0 font-mono text-[11px] text-slate-500 dark:text-neutral-400">
                {row.name}
              </span>
              <div className="h-5 flex-1 overflow-hidden rounded bg-stone-100 dark:bg-neutral-800">
                <div className={`h-full rounded ${row.cls}`} style={{ width: `${Math.max(4, (row.value / max) * 100)}%` }} />
              </div>
              <span className="w-16 shrink-0 text-right font-mono text-xs font-bold">
                ₹{row.value}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function StockDonut({
  slices,
  centerLabel,
}: {
  slices: { label: string; value: number; color: string }[];
  centerLabel: string;
}) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const R = 54;
  const C = 2 * Math.PI * R;
  // Start offset of each arc = sum of all previous fractions (no mutation).
  const offsets = useMemo(
    () =>
      slices.map((_, i) =>
        slices.slice(0, i).reduce((s, x) => s + x.value / total, 0),
      ),
    [slices, total],
  );
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <div className="relative shrink-0">
        <svg width={150} height={150} viewBox="0 0 150 150">
          <circle cx={75} cy={75} r={R} fill="none" strokeWidth={20} className="stroke-stone-100 dark:stroke-neutral-800" />
          {slices.map((s, i) => {
            const frac = s.value / total;
            return (
              <circle
                key={s.label}
                cx={75}
                cy={75}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={20}
                strokeDasharray={`${frac * C} ${C}`}
                strokeDashoffset={-offsets[i] * C}
                transform="rotate(-90 75 75)"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-mono text-lg font-bold">{centerLabel}</p>
            <p className="font-mono text-[10px] text-slate-500 dark:text-neutral-400">total kg</p>
          </div>
        </div>
      </div>
      <div className="w-full space-y-1.5">
        {slices.map((s) => (
          <p key={s.label} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="font-mono text-slate-500 dark:text-neutral-400">
              {s.value.toLocaleString("en-IN")} kg · {Math.round((s.value / total) * 100)}%
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

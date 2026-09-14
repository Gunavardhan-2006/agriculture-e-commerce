import { listings } from "./demo-data";
import type { Listing } from "@/types";

/* ---- Stock-value analytics (used by the farmer dashboard) ---- */

/** Live stock value of one listing: quantity × listed price. */
export const stockValue = (l: Listing) => l.quantity * l.price;

/** Paddy lots: Sona Masoori Paddy, Basmati Paddy, … */
export const isPaddy = (l: Listing) => /paddy/i.test(l.variety);

export const isVegetable = (l: Listing) => l.category === "Vegetables";

export const totalStockValue = (listings: Listing[]) =>
  listings.reduce((sum, l) => sum + stockValue(l), 0);

export type CategoryStat = {
  category: string;
  value: number;
  listings: number;
  share: number;
};

export function categoryStats(listings: Listing[]): CategoryStat[] {
  const total = totalStockValue(listings) || 1;
  const byCategory = new Map<string, { value: number; listings: number }>();
  for (const l of listings) {
    const entry = byCategory.get(l.category) ?? { value: 0, listings: 0 };
    entry.value += stockValue(l);
    entry.listings += 1;
    byCategory.set(l.category, entry);
  }
  return [...byCategory.entries()]
    .map(([category, s]) => ({ category, ...s, share: s.value / total }))
    .sort((a, b) => b.value - a.value);
}

export function topByValue(listings: Listing[], n = 6): Listing[] {
  return [...listings]
    .sort((a, b) => stockValue(b) - stockValue(a))
    .slice(0, n);
}

/* ---- Market-price trend analytics (used by /analytics) ---- */

/** Fixed reference Monday so server/client renders never disagree (no hydration flicker). */
const REF_DATE = new Date(2026, 8, 14);

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function weekLabel(weeksAgo: number): string {
  const d = new Date(REF_DATE);
  d.setDate(d.getDate() - weeksAgo * 7);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export interface TrendPoint {
  label: string;
  price: number;
}

export interface CropTrend {
  id: string;
  variety: string;
  category: string;
  unit: string;
  current: number;
  baseline: number;
  history: TrendPoint[];
  changePct: number;
  min: number;
  max: number;
}

/**
 * Deterministic weekly mandi-price history for a listing: a mean-reverting
 * walk anchored on the regional baseline, ending exactly at today's listed
 * price. Same input always yields the same series.
 */
export function priceHistory(listing: Listing, weeks: number): TrendPoint[] {
  const rand = mulberry32(hashSeed(`${listing.id}:${weeks}`));
  const backward: number[] = [listing.price];
  for (let i = 1; i < weeks; i++) {
    const newer = backward[0];
    const pull = (listing.suggested - newer) * 0.18;
    const shock = (rand() - 0.5) * 2 * listing.suggested * 0.045;
    backward.unshift(Math.max(1, round1(newer - pull - shock)));
  }
  return backward.map((price, i) => ({
    label: weekLabel(weeks - 1 - i),
    price,
  }));
}

export function cropTrend(listing: Listing, weeks: number): CropTrend {
  const history = priceHistory(listing, weeks);
  const prices = history.map((p) => p.price);
  const first = prices[0];
  return {
    id: listing.id,
    variety: listing.variety,
    category: listing.category,
    unit: listing.unit,
    current: listing.price,
    baseline: listing.suggested,
    history,
    changePct: round1(((listing.price - first) / first) * 100),
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export function getTrend(id: string, weeks: number): CropTrend | undefined {
  const listing = listings.find((l) => l.id === id);
  return listing ? cropTrend(listing, weeks) : undefined;
}

export interface CategoryPriceStat {
  category: string;
  count: number;
  totalQty: number;
  avgPrice: number;
  avgBaseline: number;
  gapPct: number;
}

export function categoryPriceStats(): CategoryPriceStat[] {
  const groups = Object.groupBy(listings, (l) => l.category);
  return Object.entries(groups).map(([category, items]) => {
    const list = items!;
    const avgPrice = list.reduce((s, l) => s + l.price, 0) / list.length;
    const avgBaseline = list.reduce((s, l) => s + l.suggested, 0) / list.length;
    return {
      category,
      count: list.length,
      totalQty: Math.round(list.reduce((s, l) => s + l.quantity, 0)),
      avgPrice: round1(avgPrice),
      avgBaseline: round1(avgBaseline),
      gapPct: round1(((avgPrice - avgBaseline) / avgBaseline) * 100),
    };
  });
}

export interface Mover {
  id: string;
  variety: string;
  category: string;
  price: number;
  baseline: number;
  gapPct: number;
}

/** Products furthest from their regional baseline (either direction). */
export function topMovers(limit = 8): Mover[] {
  return listings
    .map((l) => ({
      id: l.id,
      variety: l.variety,
      category: l.category,
      price: l.price,
      baseline: l.suggested,
      gapPct: round1(((l.price - l.suggested) / l.suggested) * 100),
    }))
    .sort((a, b) => Math.abs(b.gapPct) - Math.abs(a.gapPct))
    .slice(0, limit);
}

/** Curated crop shortlist for the trend-chart selector (paddy first). */
export const FEATURED_CROP_IDS = [
  "rice-01",
  "rice-02",
  "tom-01",
  "onion-01",
  "wheat-01",
  "maize-01",
  "moong-01",
  "chilli-01",
  "mango-01",
  "pot-01",
];

export const DEFAULT_TREND_IDS = ["rice-01", "rice-02", "tom-01", "onion-01"];

export function featuredCrops(): Listing[] {
  return FEATURED_CROP_IDS.map(
    (id) => listings.find((l) => l.id === id)!,
  ).filter(Boolean);
}

export const SERIES_COLORS = [
  "#047857",
  "#d97706",
  "#e11d48",
  "#ea580c",
  "#0d9488",
  "#65a30d",
  "#78716c",
  "#7c3aed",
  "#0891b2",
  "#be185d",
];

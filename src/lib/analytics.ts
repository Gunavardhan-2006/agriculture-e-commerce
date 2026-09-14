import type { Listing } from "@/types";

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
  return [...listings].sort((a, b) => stockValue(b) - stockValue(a)).slice(0, n);
}

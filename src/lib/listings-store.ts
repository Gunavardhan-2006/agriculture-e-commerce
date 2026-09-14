import type { Listing } from "@/types";
import { listings as demoListings } from "@/lib/demo-data";
import { readCart, saveCart } from "@/lib/cart";

export const MY_LISTINGS_KEY = "agrilink-my-listings";
export const DELETED_LISTINGS_KEY = "agrilink-deleted-listings";
export const LISTINGS_EVENT = "agrilink-listings-change";

const isBrowser = () => typeof window !== "undefined";

function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors (private mode etc.)
  }
}

export function notifyListingsChanged() {
  if (isBrowser()) window.dispatchEvent(new Event(LISTINGS_EVENT));
}

/** Listings the signed-in farmer published from the dashboard form. */
export function getMyListings(): Listing[] {
  const items = readJSON<Listing[]>(MY_LISTINGS_KEY, []);
  return Array.isArray(items) ? items : [];
}

/** Demo listing ids the farmer deleted. */
export function getDeletedIds(): string[] {
  const ids = readJSON<string[]>(DELETED_LISTINGS_KEY, []);
  return Array.isArray(ids) ? ids : [];
}

/** Everything visible across marketplace, home and dashboard. */
export function getVisibleListings(): Listing[] {
  const mine = getMyListings();
  const deleted = new Set(getDeletedIds());
  return [...mine, ...demoListings.filter((l) => !deleted.has(l.id))];
}

export function displayNameFromEmail(email: string): string {
  const prefix = email.split("@")[0] ?? "";
  const name = prefix
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return name || "Member";
}

export function currentFarmerName(): string {
  if (!isBrowser()) return "Member";
  try {
    const email = window.localStorage.getItem("agrilink-demo-user") ?? "";
    return email ? displayNameFromEmail(email) : "Member";
  } catch {
    return "Member";
  }
}

export type NewListingInput = {
  variety: string;
  category: string;
  quantity: number;
  unit: string;
  grade: string;
  price: number;
  availableUntil: string;
};

export function addMyListing(input: NewListingInput): Listing {
  const listing: Listing = {
    id: `mine-${Date.now().toString(36)}`,
    variety: input.variety.trim() || "Untitled produce",
    category: input.category,
    quantity: input.quantity,
    unit: input.unit,
    grade: input.grade,
    price: input.price,
    suggested: input.price,
    farmer: currentFarmerName(),
    village: "Chevella, Telangana",
    distance: 12,
    rating: 5,
    harvest: "Today",
    availableUntil: input.availableUntil,
    delivery: ["Pickup"],
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85",
    status: "active",
  };
  writeJSON(MY_LISTINGS_KEY, [...getMyListings(), listing]);
  notifyListingsChanged();
  return listing;
}

/**
 * Completely removes a listing: farmer-published ones are dropped from
 * storage, demo ones are recorded as deleted. Also purges the listing
 * from the cart so a deleted product can never be checked out.
 */
export function deleteListingById(id: string) {
  const mine = getMyListings();
  if (mine.some((l) => l.id === id)) {
    writeJSON(
      MY_LISTINGS_KEY,
      mine.filter((l) => l.id !== id),
    );
  } else {
    const deleted = getDeletedIds();
    if (!deleted.includes(id)) {
      writeJSON(DELETED_LISTINGS_KEY, [...deleted, id]);
    }
  }
  try {
    const cart = readCart();
    if (cart.some((item) => item.id === id)) {
      saveCart(cart.filter((item) => item.id !== id));
    }
  } catch {
    // cart cleanup is best-effort
  }
  notifyListingsChanged();
}

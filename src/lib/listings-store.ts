import type { Listing } from "@/types";
import { listings as demoListings } from "@/lib/demo-data";
import { readCart, saveCart } from "@/lib/cart";

export const MY_LISTINGS_KEY = "agrilink-my-listings";
export const DELETED_LISTINGS_KEY = "agrilink-deleted-listings";
export const BLOCKED_LISTINGS_KEY = "agrilink-blocked-listings";
export const LISTINGS_EVENT = "agrilink-listings-change";

/** Demo identity allowed to block/unblock products (mirrors AdminGate). */
export const ADMIN_DEMO_EMAIL = "admin@agrilink.demo";

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

/** Listing ids the admin has blocked. Blocked products are hidden from every product list. */
export function getBlockedIds(): string[] {
  const ids = readJSON<string[]>(BLOCKED_LISTINGS_KEY, []);
  return Array.isArray(ids) ? ids : [];
}

export function isListingBlocked(id: string): boolean {
  return getBlockedIds().includes(id);
}

function currentDemoEmail(): string {
  if (!isBrowser()) return "";
  try {
    return window.localStorage.getItem("agrilink-demo-user") ?? "";
  } catch {
    return "";
  }
}

/** Only the admin demo identity may block/unblock products. */
export function isAdminSession(): boolean {
  return currentDemoEmail().toLowerCase() === ADMIN_DEMO_EMAIL;
}

function purgeIdFromCart(id: string) {
  try {
    const cart = readCart();
    if (cart.some((item) => item.id === id)) {
      saveCart(cart.filter((item) => item.id !== id));
    }
  } catch {
    // cart cleanup is best-effort
  }
}

/**
 * Admin-only: hides a product from the marketplace, home page, dashboard
 * lists, and detail pages. Returns false when the caller is not an admin.
 */
export function blockListingById(id: string): boolean {
  if (!isAdminSession()) return false;
  const blocked = getBlockedIds();
  if (!blocked.includes(id)) {
    writeJSON(BLOCKED_LISTINGS_KEY, [...blocked, id]);
  }
  purgeIdFromCart(id);
  notifyListingsChanged();
  return true;
}

/** Admin-only: makes a blocked product visible again. */
export function unblockListingById(id: string): boolean {
  if (!isAdminSession()) return false;
  writeJSON(
    BLOCKED_LISTINGS_KEY,
    getBlockedIds().filter((blockedId) => blockedId !== id),
  );
  notifyListingsChanged();
  return true;
}

/** Everything visible across marketplace, home and dashboard (excludes blocked). */
export function getVisibleListings(): Listing[] {
  const mine = getMyListings();
  const deleted = new Set(getDeletedIds());
  const blocked = new Set(getBlockedIds());
  return [
    ...mine.filter((l) => !blocked.has(l.id)),
    ...demoListings.filter((l) => !deleted.has(l.id) && !blocked.has(l.id)),
  ];
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
  phone: string;
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
    phone: input.phone.trim() || "+91 90000 00000",
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

"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { CartItem } from "@/types";
import { CART_EVENT, readCart, saveCart } from "@/lib/cart";
import { buyerCost } from "@/lib/pricing";

let cache: CartItem[] | null = null;

function getSnapshot(): CartItem[] {
  if (cache === null) cache = readCart();
  return cache;
}

function getServerSnapshot(): CartItem[] {
  return [];
}

function subscribe(callback: () => void) {
  const onChange = () => {
    cache = null;
    callback();
  };
  window.addEventListener(CART_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CART_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export type CartTotals = {
  subtotal: number;
  logistics: number;
  platform: number;
  total: number;
};

/**
 * Reactive cart shared by the badge, cart page and checkout.
 * SSR-safe (empty on server, hydrates from localStorage) and updates
 * live in every mounted consumer whenever the cart changes.
 */
export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const totals: CartTotals = useMemo(
    () =>
      items.reduce<CartTotals>(
        (acc, item) => {
          const cost = buyerCost(item.price, item.cartQty, item.distance);
          return {
            subtotal: acc.subtotal + cost.subtotal,
            logistics: acc.logistics + cost.logistics,
            platform: acc.platform + cost.platformFee,
            total: acc.total + cost.total,
          };
        },
        { subtotal: 0, logistics: 0, platform: 0, total: 0 },
      ),
    [items],
  );

  const updateQty = (id: string, delta: number) =>
    saveCart(
      items.map((x) =>
        x.id === id
          ? {
              ...x,
              cartQty: Math.min(x.quantity, Math.max(1, x.cartQty + delta)),
            }
          : x,
      ),
    );

  const removeItem = (id: string) => saveCart(items.filter((x) => x.id !== id));

  const clear = () => saveCart([]);

  return { items, totals, count: items.length, updateQty, removeItem, clear };
}

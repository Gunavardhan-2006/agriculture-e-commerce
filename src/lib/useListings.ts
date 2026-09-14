"use client";

import { useCallback, useEffect, useState } from "react";
import type { Listing } from "@/types";
import { listings as demoListings } from "@/lib/demo-data";
import {
  LISTINGS_EVENT,
  deleteListingById,
  getMyListings,
  getVisibleListings,
} from "@/lib/listings-store";

/**
 * Reactive view over demo listings + farmer-published listings minus
 * deletions. Starts from static demo data (SSR-safe, no hydration
 * mismatch) then syncs with localStorage on mount and on every change.
 */
export function useListings() {
  const [visible, setVisible] = useState<Listing[]>(demoListings);
  const [mine, setMine] = useState<Listing[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    setVisible(getVisibleListings());
    setMine(getMyListings());
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(LISTINGS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(LISTINGS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const remove = useCallback((id: string) => {
    deleteListingById(id);
  }, []);

  return {
    listings: visible,
    myListings: mine,
    loaded,
    refresh,
    deleteListing: remove,
  };
}

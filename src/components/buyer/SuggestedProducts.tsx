"use client";

import type { Listing } from "@/types";
import { ProduceCard } from "./ProduceCard";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { useListings } from "@/lib/useListings";

export function SuggestedProducts({ listing }: { listing: Listing }) {
  const { t } = useLanguage();
  const { listings } = useListings();
  const suggestions = listings
    .filter((item) => item.id !== listing.id)
    .sort(
      (a, b) =>
        Number(b.category === listing.category) +
        Number(b.distance < 80) -
        (Number(a.category === listing.category) + Number(a.distance < 80)),
    )
    .slice(0, 3);
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <div className="border-t border-stone-200 pt-9 dark:border-neutral-800">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          {t("More from the market board")}
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold">
          {t("You may also need")}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-neutral-300">
          {t("Similar quality, nearby harvests, and complementary produce.")}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((item) => (
            <ProduceCard key={item.id} listing={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

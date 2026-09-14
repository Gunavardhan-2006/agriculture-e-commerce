"use client";

import Link from "next/link";
import { MapPin, PackageCheck } from "lucide-react";
import type { Listing } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { RatingStars } from "@/components/shared/RatingStars";
import { formatCurrency, formatQuantity } from "@/lib/utils";
import { useLanguage } from "@/components/shared/LanguageProvider";

export function ProduceCard({ listing }: { listing: Listing }) {
  const { t } = useLanguage();
  return (
    <Link
      href={`/marketplace/${listing.id}`}
      className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-emerald-700"
    >
      <div className="relative h-44 overflow-hidden">
        <ImageWithFallback
          src={listing.image}
          alt={listing.variety}
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge tone="emerald">{listing.grade}</Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/75 px-3 py-2 text-[11px] text-white">
          <span className="font-mono">
            {t("Harvested")} {listing.harvest}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className="truncate font-display font-bold text-slate-900 dark:text-stone-100"
              title={listing.variety}
            >
              {listing.variety}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
              {t(listing.category)}
            </p>
          </div>
          <p className="shrink-0 font-mono text-lg font-bold text-emerald-800 dark:text-emerald-400">
            {formatCurrency(listing.price)}
            <span className="text-xs font-normal">/{listing.unit}</span>
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-2 border-y border-stone-100 py-3 font-mono text-[11px] text-slate-600 dark:border-neutral-800 dark:text-neutral-300">
          <span className="flex items-center gap-1">
            <PackageCheck size={13} />{" "}
            {formatQuantity(listing.quantity, listing.unit)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {listing.distance} {t("km away")}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-neutral-200">
            {listing.farmer}
          </span>
          <RatingStars rating={listing.rating} />
        </div>
      </div>
    </Link>
  );
}

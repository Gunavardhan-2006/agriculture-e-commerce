"use client";
import { useState } from "react";
import { MessageCircle, Minus, Phone, Plus, ShoppingBasket } from "lucide-react";
import type { Listing } from "@/types";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { RatingStars } from "@/components/shared/RatingStars";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DeliveryEstimateCard } from "@/components/shared/DeliveryEstimateCard";
import { buyerCost } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { addToCart } from "@/lib/cart";
import { ReportListing } from "@/components/buyer/ReportListing";
import { useLanguage } from "@/components/shared/LanguageProvider";

export function ListingDetail({ listing }: { listing: Listing }) {
  const { t } = useLanguage();
  const [qty, setQty] = useState(Math.max(1, Math.min(5, listing.quantity)));
  const [added, setAdded] = useState(false);
  const cost = buyerCost(listing.price, qty, listing.distance);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <div className="relative h-72 overflow-hidden rounded-xl sm:h-96">
            <ImageWithFallback
              src={listing.image}
              alt={listing.variety}
              className="object-cover"
            />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
              <p className="font-mono text-[10px] text-slate-500 dark:text-neutral-400">
                {t("QUALITY")}
              </p>
              <p className="mt-1 text-sm font-bold">{listing.grade}</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
              <p className="font-mono text-[10px] text-slate-500 dark:text-neutral-400">
                {t("HARVEST")}
              </p>
              <p className="mt-1 text-sm font-bold">{listing.harvest}</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
              <p className="font-mono text-[10px] text-slate-500 dark:text-neutral-400">
                {t("STOCK")}
              </p>
              <p className="mt-1 text-sm font-bold">
                {listing.quantity} {listing.unit}
              </p>
            </div>
          </div>
        </div>
        <aside>
          <div className="flex items-center gap-2">
            <Badge tone="emerald">{t(listing.category)}</Badge>
            <Badge tone="amber">{listing.grade}</Badge>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
            {listing.variety}
          </h1>
          <p className="mt-2 font-mono text-3xl font-bold text-emerald-800 dark:text-emerald-400">
            {formatCurrency(listing.price)}{" "}
            <span className="text-base font-normal">
              {t("per")} {listing.unit}
            </span>
          </p>
          <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{listing.farmer}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-neutral-300">
                  {listing.village} · {listing.distance} {t("km away")}
                </p>
              </div>
              <RatingStars rating={listing.rating} />
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-stone-100 pt-3 dark:border-neutral-800">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Phone size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase tracking-wide text-slate-500 dark:text-neutral-400">
                  {t("Seller phone · bulk orders")}
                </p>
                <a
                  href={`tel:${listing.phone.replace(/[^+\d]/g, "")}`}
                  className="font-mono text-sm font-bold text-emerald-800 hover:underline dark:text-emerald-300"
                >
                  {listing.phone}
                </a>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <DeliveryEstimateCard
              fee={cost.logistics}
              distance={listing.distance}
            />
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg border border-stone-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
            <span className="text-sm font-semibold">{t("Quantity")}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="rounded border border-stone-300 p-1 dark:border-neutral-700"
              >
                <Minus size={15} />
              </button>
              <span className="w-16 text-center font-mono text-sm">
                {qty} kg
              </span>
              <button
                onClick={() => setQty(Math.min(listing.quantity, qty + 1))}
                className="rounded border border-stone-300 p-1 dark:border-neutral-700"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button
              className="flex-1"
              onClick={() => {
                addToCart(listing, qty);
                setAdded(true);
              }}
            >
              <ShoppingBasket size={17} />
              {added ? t("Added to cart") : t("Add to cart")}
            </Button>
            <Button variant="outline">
              <MessageCircle size={17} /> {t("Inquiry")}
            </Button>
          </div>
          <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            {t(
              "Minimum bulk order: 20 kg. Stock is verified again at checkout to protect against orders placed by other buyers.",
            )}
          </p>
          <a
            href={`tel:${listing.phone.replace(/[^+\d]/g, "")}`}
            className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900"
          >
            <Phone size={16} />
            {t("Call seller for bulk orders")} · {listing.phone}
          </a>
          <ReportListing listing={listing} />
        </aside>
      </div>
    </main>
  );
}

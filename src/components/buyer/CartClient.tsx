"use client";
import Link from "next/link";
import { Minus, Plus, ShieldCheck, ShoppingBasket, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { useCart } from "@/lib/useCart";

export function CartClient() {
  const { t } = useLanguage();
  const { items, totals, updateQty, removeItem } = useCart();

  if (!items.length)
    return (
      <div className="mt-7 rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-950">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <ShoppingBasket size={24} />
        </span>
        <p className="mt-4 font-display text-xl font-bold">
          {t("Your cart is empty.")}
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {t("Pick freshly listed produce from the market board.")}
        </p>
        <Link href="/marketplace">
          <Button className="mt-6">{t("Browse marketplace")}</Button>
        </Link>
      </div>
    );

  return (
    <div className="mt-7 grid items-start gap-5 lg:grid-cols-[1fr_.7fr]">
      <Card className="overflow-hidden">
        <div className="divide-y divide-stone-200 dark:divide-slate-800">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 sm:p-5">
              <Link
                href={`/marketplace/${item.id}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-stone-200 dark:border-slate-800 sm:h-24 sm:w-24"
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.variety}
                  className="object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/marketplace/${item.id}`}
                    className="truncate font-display font-bold hover:text-emerald-800 dark:hover:text-emerald-300"
                  >
                    {item.variety}
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`${t("Remove from cart")}: ${item.variety}`}
                    title={t("Remove from cart")}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-700 dark:text-slate-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {item.farmer} · {item.village}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                  {formatCurrency(item.price)}/{item.unit} · {item.distance}{" "}
                  {t("km away")}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      aria-label={t("Decrease quantity")}
                      className="rounded-lg border border-stone-300 p-1.5 transition hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-16 text-center font-mono text-sm font-semibold">
                      {item.cartQty} {item.unit}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      aria-label={t("Increase quantity")}
                      disabled={item.cartQty >= item.quantity}
                      className="rounded-lg border border-stone-300 p-1.5 transition hover:border-emerald-600 hover:text-emerald-700 disabled:opacity-40 dark:border-slate-700 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  <p className="font-mono font-bold text-emerald-800 dark:text-emerald-300">
                    {formatCurrency(item.price * item.cartQty)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="h-fit p-5">
        <p className="font-display text-xl font-bold">{t("Order summary")}</p>
        <div className="mt-4 space-y-3 border-b border-stone-200 pb-4 text-sm dark:border-slate-800">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-300">
              {t("Produce")}
            </span>
            <span className="font-mono">{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-300">
              {t("Delivery estimate")}
            </span>
            <span className="font-mono">
              {formatCurrency(totals.logistics)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-300">
              {t("Platform fee")}
            </span>
            <span className="font-mono">{formatCurrency(totals.platform)}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between font-bold">
          <span>{t("Total")}</span>
          <span className="font-mono">{formatCurrency(totals.total)}</span>
        </div>
        <Link href="/checkout">
          <Button className="mt-5 w-full">{t("Continue to checkout")}</Button>
        </Link>
        <Link
          href="/marketplace"
          className="mt-3 block text-center text-sm font-bold text-emerald-800 hover:underline dark:text-emerald-300"
        >
          {t("Continue shopping")}
        </Link>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck size={14} />
          {t("Demo checkout — no payment details are stored.")}
        </p>
      </Card>
    </div>
  );
}

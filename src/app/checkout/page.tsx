"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, MapPin, ShoppingBasket, Truck, Wallet } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { CheckoutPanel } from "@/components/buyer/CheckoutPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { useCart } from "@/lib/useCart";

const SLOTS = ["Tomorrow · 9–12", "Tomorrow · 2–5"] as const;

export default function Checkout() {
  const { t } = useLanguage();
  const { items, totals } = useCart();
  const [slot, setSlot] = useState<(typeof SLOTS)[number]>(SLOTS[0]);

  const steps = [
    { Icon: ShoppingBasket, label: t("Cart"), href: "/cart" as const, done: true },
    { Icon: Truck, label: t("Delivery details"), href: null, done: false },
    { Icon: Wallet, label: t("Payment"), href: null, done: false },
  ];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          {t("Checkout · secure demo flow")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold">
          {t("Confirm collection & delivery")}
        </h1>

        <ol className="mt-6 flex items-center gap-2 text-xs font-bold sm:gap-3 sm:text-sm">
          {steps.map(({ Icon, label, href, done }, i) => (
            <li key={label} className="flex items-center gap-2 sm:gap-3">
              {i > 0 && (
                <span className="h-px w-6 bg-stone-300 dark:bg-slate-700 sm:w-12" />
              )}
              {href ? (
                <Link
                  href={href}
                  className="flex items-center gap-2 text-emerald-800 hover:underline dark:text-emerald-300"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-700 text-white">
                    {done ? <Check size={14} /> : <Icon size={14} />}
                  </span>
                  {label}
                </Link>
              ) : (
                <span
                  className={`flex items-center gap-2 ${i === 1 ? "text-slate-900 dark:text-stone-100" : "text-slate-400 dark:text-slate-500"}`}
                >
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full ${i === 1 ? "bg-emerald-700 text-white" : "border border-stone-300 text-slate-400 dark:border-slate-700 dark:text-slate-500"}`}
                  >
                    <Icon size={14} />
                  </span>
                  {label}
                </span>
              )}
            </li>
          ))}
        </ol>

        {items.length === 0 ? (
          <Card className="mt-7 p-10 text-center">
            <p className="font-display text-xl font-bold">
              {t("Your cart is empty.")}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t("Pick freshly listed produce from the market board.")}
            </p>
            <Link href="/marketplace">
              <Button className="mt-6">{t("Browse marketplace")}</Button>
            </Link>
          </Card>
        ) : (
          <div className="mt-7 grid items-start gap-5 md:grid-cols-[1fr_.8fr]">
            <div className="space-y-5">
              <Card className="p-5">
                <h2 className="flex items-center gap-2 font-display text-xl font-bold">
                  <MapPin size={18} className="text-emerald-700 dark:text-emerald-400" />
                  {t("Delivery details")}
                </h2>
                <input
                  defaultValue="Road No. 12, Banjara Hills, Hyderabad"
                  aria-label={t("Delivery details")}
                  className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-100 dark:placeholder:text-slate-500"
                />
                <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t("Delivery slot")}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {SLOTS.map((s) => {
                    const active = slot === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSlot(s)}
                        aria-pressed={active}
                        className={`flex items-center justify-between gap-2 rounded-lg border p-3 text-left text-sm font-semibold transition ${active ? "border-emerald-700 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-100" : "border-stone-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"}`}
                      >
                        {t(s)}
                        {active && (
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-700 text-white">
                            <Check size={12} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Card>
              <CheckoutPanel />
            </div>

            <Card className="h-fit p-5">
              <h2 className="font-display text-xl font-bold">
                {t("Order summary")}
              </h2>
              <div className="mt-4 space-y-3 border-b border-stone-200 pb-4 text-sm dark:border-slate-800">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <span className="min-w-0 truncate text-slate-600 dark:text-slate-300">
                      {item.variety} × {item.cartQty} {item.unit}
                    </span>
                    <span className="shrink-0 font-mono">
                      {formatCurrency(item.price * item.cartQty)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">
                    {t("Produce")}
                  </span>
                  <span className="font-mono">
                    {formatCurrency(totals.subtotal)}
                  </span>
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
                  <span className="font-mono">
                    {formatCurrency(totals.platform)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-3 font-bold dark:border-slate-800">
                  <span>{t("Total")}</span>
                  <span className="font-mono">
                    {formatCurrency(totals.total)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}

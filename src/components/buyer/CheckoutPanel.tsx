"use client";
import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  LoaderCircle,
  Smartphone,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { useCart } from "@/lib/useCart";

export function CheckoutPanel() {
  const { t } = useLanguage();
  const { totals, clear } = useCart();
  const [method, setMethod] = useState<"upi" | "card" | "cod">("upi"),
    [state, setState] = useState<"idle" | "processing" | "success" | "failed">(
      "idle",
    );
  const pay = () => {
    setState("processing");
    setTimeout(() => {
      clear();
      setState("success");
    }, 2000);
  };
  if (state === "success")
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-7 text-center dark:border-emerald-900 dark:bg-emerald-950">
        <p className="font-display text-2xl font-bold text-emerald-950 dark:text-emerald-100">
          {t("Order placed successfully.")}
        </p>
        <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200">
          {t("Payment record AGRPAY-90217 saved. Farmer confirmation is next.")}
        </p>
        <Link
          href="/orders/AGR-240914-82"
          className="mt-5 inline-flex rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white"
        >
          {t("Track order")}
        </Link>
      </div>
    );
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
      <h2 className="font-display text-xl font-bold">{t("Payment")}</h2>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {t("Demo checkout — no payment details are stored.")}
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          ["upi", Smartphone, "UPI"],
          ["card", CreditCard, "Card"],
          ["cod", WalletCards, "COD"],
        ].map(([id, Icon, label]) => {
          const I = Icon as typeof Smartphone;
          return (
            <button
              key={String(id)}
              onClick={() => setMethod(id as typeof method)}
              className={`rounded-lg border p-3 text-center text-xs font-bold transition ${method === id ? "border-emerald-700 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-200" : "border-stone-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"}`}
            >
              <I className="mx-auto mb-1" size={18} />
              {String(label)}
            </button>
          );
        })}
      </div>
      {method === "upi" && (
        <input
          className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-100 dark:placeholder:text-slate-500"
          placeholder="yourname@upi"
        />
      )}
      {method === "card" && (
        <div className="mt-4 grid gap-3">
          <input
            className="rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-100 dark:placeholder:text-slate-500"
            placeholder="DEMO ONLY — card number"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-100 dark:placeholder:text-slate-500"
              placeholder="MM / YY"
            />
            <input
              className="rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-100 dark:placeholder:text-slate-500"
              placeholder="CVV"
            />
          </div>
        </div>
      )}
      {method === "cod" && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          {t("Cash collection is pending on delivery. Your order can proceed.")}
        </p>
      )}
      <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4 dark:border-slate-800">
        <span className="font-mono text-sm">
          {t("Total")} {formatCurrency(totals.total)}
        </span>
        <Button onClick={pay} disabled={state === "processing"}>
          {state === "processing" && (
            <LoaderCircle className="animate-spin" size={16} />
          )}
          {method === "cod" ? t("Place order") : t("Simulate payment")}
        </Button>
      </div>
      {state === "failed" && (
        <p className="mt-3 text-sm text-red-700 dark:text-red-400">
          {t("Payment did not complete. Your order is still placed; retry safely.")}
        </p>
      )}
    </div>
  );
}

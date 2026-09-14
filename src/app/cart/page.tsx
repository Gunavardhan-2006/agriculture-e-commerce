"use client";

import { Trash2 } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { CartClient } from "@/components/buyer/CartClient";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { useCart } from "@/lib/useCart";

export default function Cart() {
  const { t } = useLanguage();
  const { count, clear } = useCart();
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">
              {t("Your collection cart")}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {count > 0
                ? t("{count} items", { count })
                : t(
                    "Adjust quantities, remove items, or continue to a final server-side stock check.",
                  )}
            </p>
          </div>
          {count > 0 && (
            <button
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-300 hover:text-red-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-800 dark:hover:text-red-400"
            >
              <Trash2 size={15} /> {t("Clear cart")}
            </button>
          )}
        </div>
        <CartClient />
      </main>
    </>
  );
}

"use client";

import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { useListings } from "@/lib/useListings";

export default function ManageListings() {
  const { t } = useLanguage();
  const { listings, myListings, deleteListing } = useListings();
  const mineIds = new Set(myListings.map((m) => m.id));
  const ordered = [
    ...myListings,
    ...listings.filter((l) => !mineIds.has(l.id)),
  ];

  const confirmDelete = (id: string) => {
    if (
      window.confirm(
        t("Delete this listing permanently? This cannot be undone."),
      )
    ) {
      deleteListing(id);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {t("SELL PRODUCE")}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold">
              {t("Manage stock")}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-neutral-300">
              {t(
                "Any AgriLink member can list fresh produce and manage their own sales.",
              )}
            </p>
          </div>
          <Link
            href="/dashboard/listings/new"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white"
          >
            <Plus size={17} /> {t("New listing")}
          </Link>
        </div>

        <Card className="mt-7 overflow-hidden">
          {ordered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-display text-xl font-bold">
                {t("No listings yet. Publish your first harvest to appear here.")}
              </p>
              <Link href="/dashboard/listings/new">
                <Button className="mt-5">
                  <Plus size={17} /> {t("New listing")}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-neutral-800">
              {ordered.map((x) => (
                <div
                  key={x.id}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold">{x.variety}</p>
                    <p className="mt-1 font-mono text-xs text-slate-500 dark:text-neutral-400">
                      {x.farmer} · {x.quantity} {x.unit} left ·{" "}
                      {formatCurrency(x.price)}/{x.unit}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge tone={mineIds.has(x.id) ? "amber" : "emerald"}>
                      {mineIds.has(x.id) ? t("Yours") : "LIVE"}
                    </Badge>
                    <button
                      onClick={() => confirmDelete(x.id)}
                      aria-label={`${t("Delete")} ${x.variety}`}
                      title={t("Delete")}
                      className="rounded-lg border border-red-200 p-2 text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </>
  );
}

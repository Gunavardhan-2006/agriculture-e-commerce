"use client";
import { useEffect, useState } from "react";
import { Check, Flag, X } from "lucide-react";
import type { Listing } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/components/shared/LanguageProvider";
import {
  REPORTS_EVENT,
  REPORT_REASONS,
  getMyReportedIds,
  submitReport,
} from "@/lib/reports";

export function ReportListing({ listing }: { listing: Listing }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [note, setNote] = useState("");
  const [reported, setReported] = useState(false);
  const [thanks, setThanks] = useState(false);

  // Reflect reports filed from any tab.
  useEffect(() => {
    const refresh = () => setReported(getMyReportedIds().includes(listing.id));
    refresh();
    window.addEventListener(REPORTS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(REPORTS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [listing.id]);

  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open ]);

  const submit = () => {
    submitReport({
      listingId: listing.id,
      variety: listing.variety,
      farmer: listing.farmer,
      reason,
      note,
    });
    setReported(true);
    setOpen(false);
    setNote("");
    setThanks(true);
  };

  if (reported && !thanks) {
    return (
      <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-neutral-400">
        <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
        {t("Reported")}
      </p>
    );
  }

  return (
    <div className="mt-3">
      {thanks ? (
        <p className="flex items-start gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          <Check size={14} className="mt-0.5 shrink-0" />
          {t("Thanks — our team will review this listing.")}
        </p>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-red-700 dark:text-neutral-400 dark:hover:text-red-400"
        >
          <Flag size={14} /> {t("Report this listing")}
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("Report this listing")}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Card className="w-full max-w-md p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold">
                  {t("Report this listing")}
                </h2>
                <p className="mt-1 truncate text-sm text-slate-600 dark:text-neutral-300">
                  {listing.variety} · {listing.farmer}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-stone-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <X size={17} />
              </button>
            </div>

            <p className="mb-2 mt-4 text-sm font-semibold">
              {t("Why are you reporting this listing?")}
            </p>
            <div role="radiogroup" className="grid gap-2">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm font-semibold transition ${reason === r ? "border-red-600 bg-red-50 text-red-900 dark:border-red-500 dark:bg-red-950 dark:text-red-100" : "border-stone-300 dark:border-neutral-700"}`}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-red-700"
                  />
                  {t(r)}
                </label>
              ))}
            </div>

            <label className="mt-4 block text-sm font-semibold">
              {t("Tell us more (optional)")}
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-stone-300 bg-white p-3 text-sm font-normal text-slate-900 outline-none placeholder:text-slate-400 focus:border-red-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-stone-100"
              />
            </label>

            <div className="mt-5 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                {t("Cancel")}
              </Button>
              <Button variant="danger" onClick={submit} className="flex-1">
                <Flag size={16} /> {t("Submit report")}
              </Button>
            </div>
          </Card>
          </div>
        </div>
      )}
    </div>
  );
}

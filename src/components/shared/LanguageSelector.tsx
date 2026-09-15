"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open ]);

  const active =
    LANGUAGES.find((entry) => entry.code === language) ?? LANGUAGES[0];

  const pick = (code: LanguageCode) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("Choose language")}
        title={t("Choose language")}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-stone-300 px-2.5 text-xs font-bold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-800 dark:border-neutral-700 dark:text-stone-200 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
      >
        <Languages size={15} className="shrink-0" />
        <span className="w-7 text-center leading-none">{active.short}</span>
        <ChevronDown
          size={13}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("Choose language")}
          className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-950"
        >
          {LANGUAGES.map((entry) => {
            const selected = entry.code === language;
            return (
              <li key={entry.code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => pick(entry.code)}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-emerald-50 dark:hover:bg-neutral-800 ${
                    selected
                      ? "font-bold text-emerald-800 dark:text-emerald-300"
                      : "text-slate-700 dark:text-neutral-200"
                  }`}
                >
                  <span>
                    <span className="block font-semibold">{entry.native}</span>
                    <span className="block text-[11px] font-normal text-slate-500 dark:text-neutral-400">
                      {entry.label}
                    </span>
                  </span>
                  {selected && <Check size={15} className="shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

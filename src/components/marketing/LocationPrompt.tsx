"use client";
import { MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/shared/LanguageProvider";

export function LocationPrompt() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false),
    [editing, setEditing] = useState(false),
    [location, setLocation] = useState("");
  useEffect(
    () =>
      setVisible(
        pathname === "/" &&
          localStorage.getItem("agrilink-location-prompt") !== "dismissed",
      ),
    [pathname],
  );
  const dismiss = () => {
    localStorage.setItem("agrilink-location-prompt", "dismissed");
    setVisible(false);
  };
  const save = () => {
    if (location.trim())
      localStorage.setItem("agrilink-location", location.trim());
    dismiss();
  };
  if (!visible) return null;
  return (
    <section className="border-b border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <MapPin
            className="shrink-0 text-amber-700 dark:text-amber-300"
            size={19}
          />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-950 dark:text-amber-100">
              {t("Set a location for nearby prices and delivery estimates")}
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              {t("You can skip this and explore every market price first.")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setEditing(true)}
              className="min-h-8 px-3 text-xs"
            >
              {t("Set location")}
            </Button>
            <button
              onClick={dismiss}
              className="inline-flex items-center gap-1 rounded px-2 py-2 text-xs font-bold text-amber-900 dark:text-amber-100"
            >
              <X size={15} /> {t("Not now")}
            </button>
          </div>
        </div>
        {editing && (
          <div className="flex flex-col gap-2 border-t border-amber-200 pt-3 sm:flex-row dark:border-amber-900">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              autoFocus
              placeholder={t("Village, district, state, or pincode")}
              className="min-h-10 flex-1 rounded-lg border border-amber-300 bg-white px-3 text-sm text-slate-900 outline-none dark:border-amber-800 dark:bg-black dark:text-stone-100"
            />
            <Button onClick={save} className="min-h-10">
              {t("Save location")}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

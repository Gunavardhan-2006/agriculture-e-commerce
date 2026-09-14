"use client";

import { Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "./LanguageProvider";

export function DeliveryEstimateCard({
  fee,
  distance,
}: {
  fee: number;
  distance: number;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
      <Truck className="mt-0.5 text-emerald-700" size={18} />
      <div>
        <p className="text-sm font-semibold text-emerald-950">
          {t("Platform-coordinated delivery")}
        </p>
        <p className="font-mono text-xs text-emerald-800">
          {t("Distance")}: {distance} km · {formatCurrency(fee)} ·{" "}
          {t("route estimate only")}
        </p>
      </div>
    </div>
  );
}

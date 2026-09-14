"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { addMyListing } from "@/lib/listings-store";

const CATEGORIES = ["Vegetables", "Fruits", "Grains", "Pulses", "Spices"];

export function ListingForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [error, setError] = useState("");
  const submit = (form: FormData) => {
    const quantity = Number(form.get("quantity"));
    const price = Number(form.get("price"));
    const start = String(form.get("from")),
      until = String(form.get("until"));
    if (quantity <= 0)
      return setError(t("Quantity must be greater than zero."));
    if (!Number.isFinite(price) || price <= 0)
      return setError(t("Price must be greater than zero."));
    if (
      !until ||
      new Date(until) <= new Date(start) ||
      new Date(until) < new Date()
    )
      return setError(
        t(
          "Available-until must be after available-from and cannot be in the past.",
        ),
      );
    setError("");
    addMyListing({
      variety: String(form.get("variety") ?? ""),
      category: String(form.get("category") ?? "Vegetables"),
      quantity,
      unit: String(form.get("unit") ?? "kg"),
      grade: String(form.get("grade") ?? "Grade A"),
      price,
      availableUntil: until,
    });
    router.push("/dashboard");
  };
  return (
    <form action={submit} className="grid gap-5">
      <label className="text-sm font-semibold">
        {t("Produce variety")}
        <input
          name="variety"
          defaultValue="Hybrid Tomato"
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-semibold">
          {t("Quantity")}
          <input
            name="quantity"
            type="number"
            defaultValue="100"
            className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          {t("Unit")}
          <select
            name="unit"
            className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal"
          >
            <option>kg</option>
            <option>quintal</option>
            <option>tonne</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          {t("Grade")}
          <select
            name="grade"
            className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal"
          >
            <option>Grade A</option>
            <option>Grade B</option>
            <option>Grade C</option>
          </select>
        </label>
      </div>
      <label className="text-sm font-semibold">
        {t("Category")}
        <select
          name="category"
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t(c)}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          {t("Available from")}
          <input
            name="from"
            type="date"
            defaultValue="2026-09-14"
            className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          {t("Available until")}
          <input
            name="until"
            type="date"
            defaultValue="2026-09-18"
            className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal"
          />
        </label>
      </div>
      <label className="text-sm font-semibold">
        {t("Expected price / kg")}
        <input
          name="price"
          type="number"
          defaultValue="28"
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal"
        />
        <span className="mt-2 block font-mono text-xs text-emerald-800">
          {t("Regional suggested price: ₹30/kg")}
        </span>
      </label>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
        {t(
          "Farm location: Chevella, Telangana. Complete your profile before publishing if this is not correct.",
        )}
      </div>
      {error && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <Button type="submit">{t("Publish listing")}</Button>
    </form>
  );
}

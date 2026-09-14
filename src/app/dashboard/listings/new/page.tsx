"use client";

import { Navbar } from "@/components/shared/Navbar";
import { Card } from "@/components/ui/Card";
import { ListingForm } from "@/components/farmer/ListingForm";
import { useLanguage } from "@/components/shared/LanguageProvider";

export default function NewListing() {
  const { t } = useLanguage();
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="font-mono text-xs text-emerald-700">
          {t("FARMER DESK / NEW LISTING")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold">
          {t("Publish harvest availability")}
        </h1>
        <Card className="mt-6 p-5">
          <ListingForm />
        </Card>
      </main>
    </>
  );
}

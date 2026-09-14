"use client";

import { Navbar } from "@/components/shared/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/shared/LanguageProvider";

export default function Register() {
  const { t } = useLanguage();
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-12">
        <Card className="p-6">
          <p className="font-mono text-xs text-emerald-700">
            {t("CREATE ACCOUNT")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold">
            {t("Join the open market")}
          </h1>
          <div className="mt-6 grid gap-4">
            <input
              placeholder={t("Full name")}
              className="rounded-lg border border-slate-300 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
            <input
              placeholder={t("Email address")}
              className="rounded-lg border border-slate-300 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
            <input
              placeholder={t("Mobile number")}
              className="rounded-lg border border-slate-300 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
            <Button>{t("Create account")}</Button>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-neutral-400">
            {t(
              "Every account can buy and sell. Add a location when you are ready to publish produce or set delivery preferences.",
            )}
          </p>
        </Card>
      </main>
    </>
  );
}

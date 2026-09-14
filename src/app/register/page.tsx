"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { signUp } from "@/lib/authclient";

export default function Register() {
  const { t } = useLanguage();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signUp.email({ name, email, password });
    setLoading(false);
    if (error) {
      setError(error.message ?? t("Could not create account"));
      return;
    }
    router.push("/");
    router.refresh();
  };
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
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t("Full name")}
              className="rounded-lg border border-slate-300 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder={t("Email address")}
              className="rounded-lg border border-slate-300 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={8}
              placeholder={t("Password (min 8 characters)")}
              className="rounded-lg border border-slate-300 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
            {error && (
              <p className="rounded bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "..." : t("Create account")}
            </Button>
          </form>
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
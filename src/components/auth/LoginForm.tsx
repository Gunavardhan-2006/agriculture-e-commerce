"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/shared/LanguageProvider";

const accounts = {
  "member@agrilink.demo": {
    password: "AgriLink@123",
    destination: "/marketplace",
  },
  "admin@agrilink.demo": { password: "Admin@123", destination: "/admin" },
  "ramesh@agrilink.demo": {
    password: "Farmer@123",
    destination: "/marketplace",
  },
  "priya@agrilink.demo": { password: "Buyer@123", destination: "/marketplace" },
} as const;

export function LoginForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const account = accounts[email.toLowerCase() as keyof typeof accounts];
    if (!account || account.password !== password) {
      setError("Use one of the demo accounts shown in DEMO_ACCOUNTS.md.");
      return;
    }
    localStorage.setItem("agrilink-demo-user", email.toLowerCase());
    router.push(account.destination);
  };
  return (
    <form onSubmit={submit} className="mt-6 grid gap-4">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder={t("Email address")}
        className="rounded-lg border border-slate-300 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder={t("Password")}
        className="rounded-lg border border-slate-300 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
      />
      {error && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <Button type="submit">{t("Sign in")}</Button>
    </form>
  );
}

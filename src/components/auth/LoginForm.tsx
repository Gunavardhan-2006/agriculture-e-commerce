"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { signIn } from "@/lib/authclient";

export function LoginForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn.email({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message ?? "Invalid email or password.");
      return;
    }
    router.push("/");
    router.refresh();
  };
  return (
    <form onSubmit={submit} className="mt-6 grid gap-4">
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
        placeholder={t("Password")}
        className="rounded-lg border border-slate-300 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
      />
      {error && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "..." : t("Sign in")}
      </Button>
    </form>
  );
}
"use client";

import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { useLanguage } from "@/components/shared/LanguageProvider";

export default function Login() {
  const { t } = useLanguage();
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-12">
        <Card className="p-6">
          <p className="font-mono text-xs text-emerald-700">
            {t("AGRLINK ACCESS")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold">
            {t("Sign in to your desk")}
          </h1>
          <LoginForm />
          <p className="mt-5 text-sm text-slate-600">
            {t("New to AgriLink?")}{" "}
            <Link href="/register" className="font-bold text-emerald-800">
              {t("Create an account")}
            </Link>
          </p>
        </Card>
      </main>
    </>
  );
}

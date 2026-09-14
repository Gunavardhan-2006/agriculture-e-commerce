"use client";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";

export function AuthControl() {
  const router = useRouter(),
    pathname = usePathname();
  const { t } = useLanguage();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(
    () => setSignedIn(Boolean(localStorage.getItem("agrilink-demo-user"))),
    [pathname],
  );
  const logout = () => {
    localStorage.removeItem("agrilink-demo-user");
    setSignedIn(false);
    router.push("/");
  };
  return signedIn ? (
    <button
      onClick={logout}
      className="hidden items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-neutral-700 dark:text-stone-100 sm:inline-flex"
    >
      <LogOut size={16} /> {t("Log out")}
    </button>
  ) : (
    <Link
      href="/login"
      className="hidden rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-emerald-700 sm:block"
    >
      {t("Sign in")}
    </Link>
  );
}

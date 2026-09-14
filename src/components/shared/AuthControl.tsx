"use client";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import { signOut, useSession } from "@/lib/authclient";

export function AuthControl() {
  const router = useRouter();
  const { t } = useLanguage();
  const { data: session } = useSession();
  const signedIn = Boolean(session?.user);
  const logout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
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
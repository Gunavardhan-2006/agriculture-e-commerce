"use client";
import Link from "next/link";
import { LoaderCircle, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import { signOut, useSession } from "@/lib/authclient";

export function AuthControl() {
  const router = useRouter();
  const { t } = useLanguage();
  const { data: session } = useSession();
  const signedIn = Boolean(session?.user);
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const logout = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  if (!signedIn || !session?.user)
    return (
      <Link
        href="/login"
        className="hidden rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-emerald-700 sm:block"
      >
        {t("Sign in")}
      </Link>
    );

  const user = session.user;
  const initials = (user.name || "?")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title={user.name}
        className="grid h-9 w-9 place-items-center rounded-full border border-slate-300 bg-white text-sm font-bold text-slate-700 hover:border-emerald-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-stone-100"
      >
        {initials || <UserRound size={16} />}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-700 text-sm font-bold text-white">
              {initials || <UserRound size={18} />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-stone-100">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-neutral-400">
                {user.email}
              </p>
            </div>
          </div>
          <dl className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs dark:border-neutral-800">
            <div className="flex items-center justify-between gap-2">
              <dt className="shrink-0 text-slate-500 dark:text-neutral-500">
                {t("Email verified")}
              </dt>
              <dd className="truncate font-semibold text-slate-700 dark:text-stone-200">
                {user.emailVerified ? "Yes" : "No"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="shrink-0 text-slate-500 dark:text-neutral-500">
                {t("User ID")}
              </dt>
              <dd className="truncate font-mono text-slate-700 dark:text-stone-200">
                {user.id}
              </dd>
            </div>
            {session.session?.createdAt && (
              <div className="flex items-center justify-between gap-2">
                <dt className="shrink-0 text-slate-500 dark:text-neutral-500">
                  {t("Member since")}
                </dt>
                <dd className="text-slate-700 dark:text-stone-200">
                  {new Date(session.session.createdAt).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>
          <button
            onClick={logout}
            disabled={signingOut}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-stone-100 dark:hover:bg-neutral-900"
          >
            {signingOut ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <LogOut size={16} />
            )}
            {signingOut ? t("Signing out…") : t("Log out")}
          </button>
        </div>
      )}
    </div>
  );
}
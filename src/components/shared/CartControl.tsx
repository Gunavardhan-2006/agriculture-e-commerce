"use client";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/lib/useCart";

export function CartControl() {
  // Badge shows the number of distinct products, not total kilograms.
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} items`}
      className="relative rounded p-2 text-slate-700 dark:text-stone-200"
    >
      <ShoppingBasket size={20} />
      {count > 0 && (
        <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-amber-400 px-1 font-mono text-[9px] text-slate-950">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

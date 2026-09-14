"use client";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  ChevronDown,
  CircleCheck,
  Eye,
  EyeOff,
  Send,
  Undo2,
} from "lucide-react";
import { listings } from "@/lib/demo-data";
import {
  LISTINGS_EVENT,
  blockListingById,
  getBlockedIds,
  unblockListingById,
} from "@/lib/listings-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Listing } from "@/types";

type State = "active" | "warned" | "suspended";

interface SellerRow {
  name: string;
  villages: string[];
  items: Listing[];
  average: number;
  flags: number;
}

const sellerRows: SellerRow[] = Object.values(
  Object.groupBy(listings, (item) => item.farmer),
).map((items) => {
  const list = items!;
  return {
    name: list[0].farmer,
    villages: [...new Set(list.map((i) => i.village))],
    items: list,
    average: Math.round(list.reduce((sum, item) => sum + item.price, 0) / list.length),
    flags: list.filter((item) => item.price > item.suggested * 1.08).length,
  };
});

function diffPct(item: Listing): number {
  return Math.round(((item.price - item.suggested) / item.suggested) * 100);
}

export function SellerModeration() {
  const [states, setStates] = useState<Record<string, State>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>(() => getBlockedIds());
  const blocked = useMemo(() => new Set(blockedIds), [blockedIds]);

  // Keep block badges live when products are blocked/unblocked (any tab).
  useEffect(() => {
    const refresh = () => setBlockedIds(getBlockedIds());
    window.addEventListener(LISTINGS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener(LISTINGS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const set = (name: string, state: State) =>
    setStates((current) => ({ ...current, [name]: state }));
  const toggleExpanded = (name: string) =>
    setExpanded((current) => ({ ...current, [name]: !current[name] }));
  const toggleBlock = (id: string) => {
    if (blocked.has(id)) unblockListingById(id);
    else blockListingById(id);
    setBlockedIds(getBlockedIds());
  };

  return (
    <div className="mt-6 space-y-4">
      {sellerRows.map((seller) => {
        const state = states[seller.name] ?? "active";
        const open = expanded[seller.name] ?? false;
        const suspended = state === "suspended";
        const warned = state === "warned";
        const blockedCount = seller.items.filter((i) => blocked.has(i.id)).length;
        return (
          <Card key={seller.name}>
            {suspended && (
              <p className="flex items-center gap-2 rounded-t-xl bg-red-700 px-5 py-2 text-xs font-bold text-white">
                <Ban size={14} /> SUSPENDED — listings hidden from the marketplace
              </p>
            )}
            {/* Clickable header: expands full selling details */}
            <button
              onClick={() => toggleExpanded(seller.name)}
              aria-expanded={open}
              className="flex w-full items-center gap-4 p-5 text-left"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-700 font-display text-lg font-bold text-white">
                {seller.name.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-xl font-bold">{seller.name}</span>
                  {state === "active" ? (
                    <Badge tone={seller.flags ? "amber" : "emerald"}>
                      {seller.flags ? `${seller.flags} PRICE FLAGS` : "CLEAR"}
                    </Badge>
                  ) : (
                    <Badge tone={warned ? "amber" : "red"}>{state.toUpperCase()}</Badge>
                  )}
                  {blockedCount > 0 && (
                    <Badge tone="red">
                      {blockedCount} BLOCKED
                    </Badge>
                  )}
                </span>
                <span className="mt-1 block truncate font-mono text-xs text-slate-500 dark:text-neutral-400">
                  {seller.villages.join(" · ")}
                </span>
                <span className="mt-1 block font-mono text-xs text-slate-500 dark:text-neutral-400">
                  {seller.items.length} listings · avg {formatCurrency(seller.average)}/unit
                  {" · "}click to {open ? "hide" : "see what they sell & at what price"}
                </span>
              </span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {/* Expanded selling details */}
            {open && (
              <div className="border-t border-stone-200 px-5 pb-5 dark:border-neutral-800">
                {seller.flags > 0 && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-amber-800 dark:text-amber-300">
                    <AlertTriangle size={16} /> Price is more than 8% above the regional
                    baseline on flagged lots.
                  </p>
                )}
                <div className="mt-4 overflow-x-auto rounded-lg border border-stone-200 dark:border-neutral-800">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                      <tr className="bg-stone-100 font-mono text-[11px] uppercase tracking-wide text-slate-500 dark:bg-neutral-800 dark:text-neutral-400">
                        <th className="px-3 py-2">Produce</th>
                        <th className="px-3 py-2">Stock</th>
                        <th className="px-3 py-2">Listed price</th>
                        <th className="px-3 py-2">Baseline</th>
                        <th className="px-3 py-2">Harvest</th>
                        <th className="px-3 py-2">Delivery</th>
                        <th className="px-3 py-2">Visibility</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-neutral-800">
                      {seller.items.map((item) => {
                        const pct = diffPct(item);
                        const over = item.price > item.suggested * 1.08;
                        const isBlocked = blocked.has(item.id);
                        return (
                          <tr key={item.id} className={isBlocked ? "opacity-60" : ""}>
                            <td className="px-3 py-2">
                              <p className="font-bold">
                                {item.variety}{" "}
                                {isBlocked && (
                                  <span className="ml-1 rounded bg-red-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-red-800">
                                    BLOCKED
                                  </span>
                                )}
                              </p>
                              <p className="font-mono text-[11px] text-slate-500 dark:text-neutral-400">
                                {item.category} · {item.grade}
                              </p>
                            </td>
                            <td className="px-3 py-2 font-mono text-xs">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="px-3 py-2 font-mono text-xs font-bold">
                              {formatCurrency(item.price)}/{item.unit}
                            </td>
                            <td className="px-3 py-2 font-mono text-xs">
                              {formatCurrency(item.suggested)}
                              <span
                                className={`ml-1 font-bold ${over ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}
                              >
                                {pct > 0 ? `+${pct}%` : `${pct}%`}
                                {over ? " ↑" : ""}
                              </span>
                            </td>
                            <td className="px-3 py-2 font-mono text-xs">{item.harvest}</td>
                            <td className="px-3 py-2 font-mono text-xs">
                              {item.delivery.join(", ")}
                            </td>
                            <td className="px-3 py-2">
                              {isBlocked ? (
                                <Button
                                  variant="outline"
                                  onClick={() => toggleBlock(item.id)}
                                  className="px-3 py-1.5 text-xs"
                                >
                                  <Eye size={14} /> Unblock
                                </Button>
                              ) : (
                                <Button
                                  variant="danger"
                                  onClick={() => toggleBlock(item.id)}
                                  className="px-3 py-1.5 text-xs"
                                  title="Hide this product from every product list"
                                >
                                  <EyeOff size={14} /> Block
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-neutral-400">
                  Blocked products disappear from the marketplace, home page, seller
                  dashboards, and detail pages for everyone.
                </p>

                {/* Moderation actions */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {warned ? (
                    <Button variant="outline" onClick={() => set(seller.name, "active")}>
                      <CircleCheck size={16} /> Clear warning
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => set(seller.name, "warned")}>
                      <Send size={16} /> Warn
                    </Button>
                  )}
                  {suspended ? (
                    <Button variant="outline" onClick={() => set(seller.name, "active")}>
                      <Undo2 size={16} /> Unsuspend
                    </Button>
                  ) : (
                    <Button variant="danger" onClick={() => set(seller.name, "suspended")}>
                      <Ban size={16} /> Suspend
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

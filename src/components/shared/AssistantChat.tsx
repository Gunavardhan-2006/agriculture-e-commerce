"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Sprout,
  Store,
  X,
} from "lucide-react";
import {
  ADMIN_CONTACT,
  answerQuery,
  type AssistantBlock,
} from "@/lib/assistant";
import { listings as demoListings } from "@/lib/demo-data";
import { formatCurrency, formatQuantity } from "@/lib/utils";
import { useLanguage } from "./LanguageProvider";
import { useListings } from "@/lib/useListings";

type Message = { id: number; role: "user" | "bot"; blocks: AssistantBlock[] };

let nextId = 1;
const userMsg = (text: string): Message => ({
  id: nextId++,
  role: "user",
  blocks: [{ kind: "text", text }],
});

function AdminCard() {
  const { t } = useLanguage();
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-left dark:border-emerald-900 dark:bg-emerald-950">
      <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-100">
        <ShieldCheck size={14} /> {ADMIN_CONTACT.name}
      </p>
      <p className="mt-0.5 text-[11px] text-emerald-800 dark:text-emerald-200">
        {ADMIN_CONTACT.role} · {ADMIN_CONTACT.hours}
      </p>
      <p className="mt-2 text-xs">
        <span className="font-semibold text-emerald-900 dark:text-emerald-100">
          {t("Mobile number")}:{" "}
        </span>
        <a
          href={`tel:${ADMIN_CONTACT.phone.replace(/[^+\d]/g, "")}`}
          className="font-mono font-bold text-emerald-800 underline dark:text-emerald-300"
        >
          {ADMIN_CONTACT.phone}
        </a>
      </p>
      <p className="mt-1 text-xs">
        <span className="font-semibold text-emerald-900 dark:text-emerald-100">
          {t("Email address")}:{" "}
        </span>
        <a
          href={`mailto:${ADMIN_CONTACT.email}`}
          className="font-mono font-bold text-emerald-800 underline dark:text-emerald-300"
        >
          {ADMIN_CONTACT.email}
        </a>
      </p>
    </div>
  );
}

function SellerCard({ listingId }: { listingId: string }) {
  const { listings } = useListings();
  const listing =
    listings.find((l) => l.id === listingId) ??
    demoListings.find((l) => l.id === listingId);
  if (!listing) return null;
  return (
    <Link
      href={`/marketplace/${listing.id}`}
      className="block rounded-lg border border-stone-200 bg-white p-3 text-left transition hover:border-emerald-400 dark:border-neutral-700 dark:bg-neutral-900"
    >
      <p className="flex items-center gap-1.5 text-xs font-bold">
        <Store size={14} className="text-emerald-700 dark:text-emerald-400" />
        {listing.variety}
      </p>
      <p className="mt-1 text-[11px] text-slate-600 dark:text-neutral-300">
        {listing.farmer} · {listing.village}
      </p>
      <p className="mt-1 font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
        {formatCurrency(listing.price)}/{listing.unit} ·{" "}
        {formatQuantity(listing.quantity, listing.unit)} in stock
      </p>
    </Link>
  );
}

function BotBlocks({ blocks }: { blocks: AssistantBlock[] }) {
  return (
    <div className="space-y-2">
      {blocks.map((b, i) => {
        if (b.kind === "admin") return <AdminCard key={i} />;
        if (b.kind === "seller") return <SellerCard key={i} listingId={b.listingId} />;
        return (
          <p key={i} className="whitespace-pre-wrap text-sm leading-6">
            {b.text}
          </p>
        );
      })}
    </div>
  );
}

export function AssistantChat() {
  const { t } = useLanguage();
  const { listings } = useListings();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: nextId++, role: "bot", blocks: answerQuery("hello").blocks },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, open]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const pushBot = (query: string, delay = 650) => {
    setTyping(true);
    timer.current = setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: nextId++, role: "bot", blocks: answerQuery(query, listings).blocks },
      ]);
      setTyping(false);
    }, delay);
  };

  const send = (raw: string) => {
    const query = raw.trim();
    if (!query || typing) return;
    setMessages((m) => [...m, userMsg(query)]);
    setInput("");
    pushBot(query);
  };

  const chips = [
    { label: t("Paddy prices"), query: "Paddy prices" },
    { label: t("Delivery estimate"), query: "What are the delivery charges?" },
    { label: t("Track order"), query: "Track my order" },
    { label: t("How to sell"), query: "How to sell" },
  ];

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label={t("AI assistant")}
          className="fixed bottom-20 right-4 z-50 flex h-[500px] max-h-[72vh] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950 sm:right-6"
        >
          <div className="flex items-center gap-2.5 bg-emerald-800 px-4 py-3 text-white">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15">
              <Sprout size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold leading-tight">
                {t("AI assistant")}
              </p>
              <p className="text-[11px] text-emerald-100">
                {t("Online · replies instantly")}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-lg p-1.5 transition hover:bg-white/15"
            >
              <X size={17} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-emerald-700 px-3 py-2 text-sm leading-6 text-white">
                    {(m.blocks[0] as { text: string }).text}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="flex justify-start">
                  <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-stone-100 px-3 py-2 text-slate-800 dark:bg-neutral-800 dark:text-neutral-100">
                    <BotBlocks blocks={m.blocks} />
                  </div>
                </div>
              ),
            )}
            {typing && (
              <div className="flex justify-start">
                <p
                  aria-label="typing"
                  className="animate-pulse rounded-2xl rounded-bl-md bg-stone-100 px-4 py-2.5 font-mono text-sm text-slate-500 dark:bg-neutral-800 dark:text-neutral-400"
                >
                  •••
                </p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-1.5 border-t border-stone-100 px-3 pt-2.5 dark:border-neutral-800">
              {chips.map((c) => (
                <button
                  key={c.label}
                  onClick={() => send(c.query)}
                  className="rounded-full border border-emerald-300 px-2.5 py-1 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("Ask about prices, delivery, orders…")}
              aria-label={t("AI assistant")}
              className="min-h-10 flex-1 rounded-lg border border-stone-300 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-stone-100"
            />
            <button
              type="submit"
              aria-label="Send"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white transition hover:bg-emerald-800"
            >
              <ArrowRight size={17} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("AI assistant")}
        className="fixed bottom-4 right-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-emerald-700 text-white shadow-lg transition hover:bg-emerald-800 sm:right-6"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { listings, categories } from "@/lib/demo-data";
import { parseMarketSearch } from "@/lib/search";
import { ProduceCard } from "./ProduceCard";

export function MarketplaceClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All produce");
  const [sort, setSort] = useState("Best match");
  const data = useMemo(() => {
    const parsed = parseMarketSearch(query);
    const activeCategory = category !== "All produce" ? category : parsed.category;
    const plainTerms = query.toLowerCase().replace(/near\s+[a-z\s]+/, " ").replace(/(?:fresh|today|harvested|under|below|less|than|₹|\d+|kg|in|the|tomato|tomatoes|okra|onion|onions|brinjal|carrot|carrots|mango|mangoes|banana|bananas|pomegranate|rice|paddy|basmati|moong|chilli|chillies)/g, " ").trim().split(/\s+/).filter(Boolean);
    return listings.filter(item => {
      const text = `${item.variety} ${item.category} ${item.farmer} ${item.village}`.toLowerCase();
      return (!activeCategory || item.category === activeCategory) && (!parsed.priceCeiling || item.price <= parsed.priceCeiling) && (!plainTerms.length || plainTerms.some(term => text.includes(term)));
    }).sort((a,b) => sort === "Price: low to high" ? a.price-b.price : sort === "Distance" ? a.distance-b.distance : b.rating-a.rating);
  }, [query, category, sort]);
  return <><section className="border-b border-stone-200 bg-white dark:border-slate-800 dark:bg-black"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><p className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">Live farm inventory · Hyderabad region</p><h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Buy closer to the source.</h1><div className="mt-6 flex flex-col gap-3 sm:flex-row"><label className="flex h-12 flex-1 items-center gap-3 rounded-lg border border-slate-300 bg-stone-50 px-4 dark:border-slate-700 dark:bg-slate-900"><Search size={18} className="text-slate-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try: fresh tomatoes under ₹30/kg near Hyderabad" className="w-full bg-transparent text-sm outline-none"/></label><select value={sort} onChange={e=>setSort(e.target.value)} className="h-12 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900"><option>Best match</option><option>Price: low to high</option><option>Distance</option></select></div></div></section><main className="mx-auto max-w-7xl px-4 py-7 sm:px-6"><div className="mb-6 flex flex-wrap gap-2">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={`rounded-full border px-3 py-2 text-sm font-semibold ${category===c?"border-emerald-700 bg-emerald-700 text-white":"border-stone-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}>{c}</button>)}<button className="ml-auto hidden items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold dark:border-slate-700 sm:flex"><SlidersHorizontal size={16}/> More filters</button></div><p className="mb-4 font-mono text-xs text-slate-500 dark:text-slate-400">{data.length} live listings · data updated 8 min ago</p>{data.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data.map(listing=><ProduceCard key={listing.id} listing={listing}/>)}</div>:<div className="rounded-xl border border-stone-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900"><p className="font-display text-xl font-bold">No produce matches those filters.</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Broaden your location, price, or freshness filter to see live farm stock.</p></div>}</main></>;
}

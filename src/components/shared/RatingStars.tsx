import { Star } from "lucide-react";
export function RatingStars({rating}:{rating:number}){return <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-700"><Star size={14} className="fill-amber-400 text-amber-500"/>{rating.toFixed(1)}</span>}

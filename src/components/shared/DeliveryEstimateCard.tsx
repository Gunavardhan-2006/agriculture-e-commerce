import { Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
export function DeliveryEstimateCard({fee,distance}:{fee:number;distance:number}){return <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3"><Truck className="mt-0.5 text-emerald-700" size={18}/><div><p className="text-sm font-semibold text-emerald-950">Platform-coordinated delivery</p><p className="font-mono text-xs text-emerald-800">Est. {distance} km · {formatCurrency(fee)} · route estimate only</p></div></div>}

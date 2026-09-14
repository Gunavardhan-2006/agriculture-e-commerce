import { estimateLogistics } from "@/lib/logistics";
export const platformFee = (subtotal:number) => Math.round(subtotal * 0.025);
export const buyerCost = (price:number, qty:number, distance:number) => { const subtotal=price*qty, logistics=estimateLogistics(distance,qty), fee=platformFee(subtotal); return {subtotal, logistics, platformFee:fee, total:subtotal+logistics+fee}; };
export const farmerNet = (price:number, qty:number, distance:number) => { const subtotal=price*qty, logistics=estimateLogistics(distance,qty), fee=platformFee(subtotal); return {gross:subtotal, logistics, platformFee:fee, net:subtotal-logistics-fee}; };
export const priceAdvisory = (listed:number, market:number) => { const delta=Math.round(((listed-market)/market)*100); return { delta, label: delta>8 ? "Above market" : delta < -8 ? "Below market" : "Competitive" }; };

export type Listing = { id: string; variety: string; category: string; quantity: number; unit: string; grade: string; price: number; suggested: number; farmer: string; phone: string; village: string; distance: number; rating: number; harvest: string; availableUntil: string; delivery: string[]; image: string; status: "active" | "paused" | "sold_out" | "deleted" };
export type CartItem = Listing & { cartQty: number };
export type MatchBreakdown = { price: number; quantity: number; quality: number; distance: number; timeline: number; total: number };

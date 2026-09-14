import type { CartItem, Listing } from "@/types";
const CART_KEY="agrilink-cart";
export const CART_EVENT="agrilink-cart-change";
const notifyCartChanged=()=>{if(typeof window!=="undefined")window.dispatchEvent(new Event(CART_EVENT))};
export const readCart=():CartItem[]=>{if(typeof window==="undefined")return [];try{return JSON.parse(localStorage.getItem(CART_KEY)??"[]")}catch{return []}};
export const saveCart=(items:CartItem[])=>{localStorage.setItem(CART_KEY,JSON.stringify(items));notifyCartChanged()};
export const addToCart=(listing:Listing, quantity:number)=>{const items=readCart();const existing=items.find(x=>x.id===listing.id);const cartQty=Math.min(listing.quantity,(existing?.cartQty??0)+quantity);saveCart(existing?items.map(x=>x.id===listing.id?{...x,cartQty}:x):[...items,{...listing,cartQty}]);return cartQty;};

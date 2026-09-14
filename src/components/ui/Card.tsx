import { cn } from "@/lib/utils";
export function Card({children,className}:{children:React.ReactNode;className?:string}){return <section className={cn("rounded-xl border border-stone-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900",className)}>{children}</section>}

"use client";
import Image from "next/image";
import { useState } from "react";
const fallback="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=85";
export function ImageWithFallback({src,alt,className}:{src:string;alt:string;className?:string}){const [url,setUrl]=useState(src||fallback);return <Image src={url} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className={className} onError={()=>setUrl(fallback)}/>}

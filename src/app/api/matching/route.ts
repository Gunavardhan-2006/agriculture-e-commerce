import { NextResponse } from "next/server"; import { listings } from "@/lib/demo-data"; import { matchListings } from "@/lib/matching";
export async function POST(request:Request){const requirement=await request.json();return NextResponse.json({matches:matchListings(listings,requirement),explanation:"Scores weight price 25, quantity 25, quality 20, distance 15, timeline 15."})}

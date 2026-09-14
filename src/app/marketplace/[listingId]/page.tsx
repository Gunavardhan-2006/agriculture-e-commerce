"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { ListingDetail } from "@/components/buyer/ListingDetail";
import { SuggestedProducts } from "@/components/buyer/SuggestedProducts";
import { Skeleton } from "@/components/ui/Skeleton";
import { useListings } from "@/lib/useListings";

export default function ListingPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = use(params);
  const { listings, loaded } = useListings();
  if (!loaded) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Skeleton className="h-72 w-full sm:h-96" />
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </main>
      </>
    );
  }
  const listing = listings.find((x) => x.id === listingId);
  if (!listing) return notFound();
  return (
    <>
      <Navbar />
      <ListingDetail listing={listing} />
      <SuggestedProducts listing={listing} />
    </>
  );
}

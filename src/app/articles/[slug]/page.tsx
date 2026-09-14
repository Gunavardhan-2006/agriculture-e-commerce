import { Suspense } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { ArticleReader } from "@/components/marketing/ArticleReader";

export default function ArticlePage() {
  return (
    <>
      <Navbar />
      {/* Required: ArticleReader uses useSearchParams(), which needs a Suspense boundary,
          otherwise navigating to an article crashes and nothing opens. */}
      <Suspense
        fallback={
          <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
            <p className="font-display text-xl font-bold">Opening article…</p>
          </main>
        }
      >
        <ArticleReader />
      </Suspense>
    </>
  );
}

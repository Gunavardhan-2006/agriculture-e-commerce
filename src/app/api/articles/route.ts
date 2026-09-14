import { NextResponse } from "next/server";
import { z } from "zod";
import { ARTICLES, ADMIN_EMAIL } from "@/lib/articles";

const translationSchema = z.object({
  title: z.string().min(3).max(160),
  excerpt: z.string().min(10).max(300),
  body: z.array(z.string().min(1)).min(1).max(30),
});

const articleSchema = z.object({
  slug: z.string().min(3).max(80),
  category: z.string().min(2).max(40),
  readMins: z.number().int().min(1).max(60).optional(),
  icon: z.enum(["sun", "drop", "book", "soil", "pest", "store", "rain", "scheme", "leaf"]).optional(),
  translations: z.object({
    en: translationSchema,
    hi: translationSchema,
    te: translationSchema,
    ta: translationSchema,
    kn: translationSchema,
    mr: translationSchema,
  }),
});

// Public: anyone can read articles in all 6 languages.
export async function GET() {
  return NextResponse.json({ articles: ARTICLES, count: ARTICLES.length });
}

// Admin-only: uploading/editing articles requires the admin demo identity.
// Client sends x-admin-email: admin@agrilink.demo (enforced by AdminGate + ArticleManager UI).
export async function POST(request: Request) {
  const adminEmail = request.headers.get("x-admin-email")?.toLowerCase();
  if (adminEmail !== ADMIN_EMAIL) {
    return NextResponse.json(
      { error: "Article publishing is restricted to admins." },
      { status: 403 },
    );
  }
  const parsed = articleSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid article." }, { status: 422 });
  }
  // Built-in catalogue is static in this demo; admin uploads are persisted
  // client-side via ArticleManager (localStorage) so they survive without a DB migration.
  // This endpoint validates shape + admin rights for any future server persistence.
  return NextResponse.json({ article: parsed.data, persisted: false }, { status: 201 });
}

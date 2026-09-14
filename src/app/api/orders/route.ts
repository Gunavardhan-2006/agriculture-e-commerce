import { NextResponse } from "next/server";
import { z } from "zod";
const schema = z.object({
  idempotencyKey: z.string().min(1),
  items: z
    .array(
      z.object({
        listingId: z.string(),
        quantity: z.number().positive(),
        availableQuantity: z.number().nonnegative(),
      }),
    )
    .min(1),
});
export async function POST(request: Request) {
  const body = schema.safeParse(await request.json());
  if (!body.success)
    return NextResponse.json(
      { error: "Invalid order payload" },
      { status: 422 },
    );
  const stale = body.data.items.find((x) => x.quantity > x.availableQuantity);
  if (stale)
    return NextResponse.json(
      {
        error: `Quantity no longer available; ${stale.availableQuantity} units left.`,
        listingId: stale.listingId,
      },
      { status: 409 },
    );
  return NextResponse.json(
    {
      orderId: `AGR-${Date.now()}`,
      status: "placed",
      paymentStatus: "pending",
    },
    { status: 201 },
  );
}

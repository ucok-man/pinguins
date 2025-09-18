import { db } from "@/lib/db-client";
import { Plan } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { default as stripe, default as Stripe } from "stripe";
import { ApiError } from "../../api-error";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  const event = stripe.webhooks.constructEvent(
    body,
    signature || "",
    process.env.STRIPE_WEBHOOK_SECRET || ""
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId } = session.metadata || { userId: null };
    if (!userId) {
      return ApiError.internalServer(
        new Error("No user id found on stripe session metadata"),
        "Stripe Webhook"
      );
    }

    await db.user.update({
      where: { id: userId },
      data: { plan: Plan.PRO },
    });
  }

  return NextResponse.json({ msg: "user plan updated" });
}

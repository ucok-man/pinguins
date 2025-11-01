import { stripe } from "@/lib/stripe-client";
import { HTTPException } from "hono/http-exception";
import { j, privateProcedure } from "../jstack";

export const paymentRouter = j.router({
  checkout: privateProcedure.mutation(async ({ c, ctx }) => {
    const product = await stripe.products.retrieve(
      process.env.STRIPE_PRO_PLAN_PRODUCT_ID ?? ""
    );

    if (!product.default_price) {
      throw new HTTPException(500, {
        message: "Stripe product default price is empty.",
      });
    }

    if (typeof product.default_price !== "string") {
      throw new HTTPException(500, {
        message: "Stripe product need to be one time payment not recurring.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: product.default_price,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      customer_email: ctx.user.email,
      metadata: {
        userId: ctx.user.id,
      },
    });

    return c.json({ session });
  }),
});

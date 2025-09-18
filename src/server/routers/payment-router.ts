import { stripe } from "@/lib/stripe-client";
import { j, privateProcedure } from "../jstack";

export const paymentRouter = j.router({
  checkout: privateProcedure.mutation(async ({ c, ctx }) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1S8JxrPVLMJL1HiHnjZxJLUr",
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

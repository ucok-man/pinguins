import { db } from "@/lib/db-client";
import { FREE_PLAN, PRO_PLAN } from "@/lib/quota";
import { createId } from "@paralleldrive/cuid2";
import { addMonths, startOfMonth } from "date-fns";
import { j, privateProcedure } from "../jstack";

export const projectRouter = j.router({
  usage: privateProcedure.query(async ({ c, ctx }) => {
    const startMonth = startOfMonth(new Date());
    const startNextMonth = startOfMonth(addMonths(startMonth, 1));

    const eventCount = await db.event.count({
      where: {
        userId: ctx.user.id,
        createdAt: {
          gte: startMonth,
          lt: startNextMonth,
        },
      },
    });

    const categoryCount = await db.eventCategory.count({
      where: {
        userId: ctx.user.id,
      },
    });

    const limit = ctx.user.plan === "PRO" ? PRO_PLAN : FREE_PLAN;

    return c.superjson({
      category: {
        used: categoryCount,
        limit: limit.maxEventCategories,
      },
      event: {
        used: eventCount,
        limit: limit.maxEventsPerMonth,
        resetDate: startNextMonth,
      },
    });
  }),

  regenerateApiKey: privateProcedure.mutation(async ({ c, ctx }) => {
    const key = createId();
    const { apikey } = await db.user.update({
      where: {
        id: ctx.user.id,
      },
      data: {
        apikey: key,
      },
    });

    return c.json({ apikey });
  }),

  connectDiscord: privateProcedure.mutation(({ c, ctx }) => {
    // 1. create authorize url and the next steps is on redirect callback
    const url = new URL(`https://discord.com/oauth2/authorize`);
    url.searchParams.set("client_id", process.env.DISCORD_CLIENT_ID!);
    url.searchParams.set("redirect_uri", process.env.DISCORD_REDIRECT_URI!);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "identify guilds.join");

    return c.json({ url: url.toString() });
  }),
});

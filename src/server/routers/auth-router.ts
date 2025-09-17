import { db } from "@/lib/db-client";
import { currentUser } from "@clerk/nextjs/server";
import { createId } from "@paralleldrive/cuid2";
import { HTTPException } from "hono/http-exception";
import { j, privateProcedure, publicProcedure } from "../jstack";

export const authRouter = j.router({
  syncUser: publicProcedure.mutation(async ({ c, ctx }) => {
    try {
      const clerkuser = await currentUser();
      if (!clerkuser) {
        return c.json({ isSynced: false });
      }
      const user = await db.user.findUnique({
        where: {
          externalId: clerkuser.id,
        },
      });

      const email = clerkuser.emailAddresses[0]?.emailAddress;
      if (!email) {
        throw new HTTPException(500, {
          message: "clerk user dont have email attached",
        });
      }

      if (!user) {
        await db.user.create({
          data: {
            externalId: clerkuser.id,
            email: email,
            quotaLimit: 100,
            plan: "FREE",
          },
        });
      }
      return c.json({ message: "OK" });
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, {
        message: `sorry we have problem in our server.`,
      });
    }
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

  whoami: privateProcedure.query(async ({ c, ctx }) => {
    return c.json({ ...ctx.user });
  }),
});

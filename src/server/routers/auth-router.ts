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

  whoami: privateProcedure.query(async ({ c, ctx }) => {
    return c.json({ ...ctx.user });
  }),
});

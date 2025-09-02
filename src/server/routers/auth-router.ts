import { db } from "@/lib/db-client";
import { currentUser } from "@clerk/nextjs/server";
import { HTTPException } from "hono/http-exception";
import { j, publicProcedure } from "../jstack";

export const authRouter = j.router({
  syncUser: publicProcedure.mutation(async ({ c, ctx }) => {
    const clerkuser = await currentUser();
    if (!clerkuser) {
      return c.json({ isSynced: false });
    }
    const user = await db.user.findFirst({
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
        },
      });
    }
    return c.json({ message: "OK" });
  }),
});

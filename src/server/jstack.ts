import { db } from "@/lib/db-client";
import { auth } from "@clerk/nextjs/server";
import { HTTPException } from "hono/http-exception";
import { jstack } from "jstack";

interface Env {
  Bindings: {};
}

export const j = jstack.init<Env>();

const withAuth = j.middleware(async ({ c, next, ctx }) => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new HTTPException(401, {
      message: "Unauthorized, sign in to continue.",
    });
  }

  const user = await db.user.findUnique({
    where: { externalId: clerkId },
  });

  if (!user) {
    throw new HTTPException(401, {
      message: "Unauthorized, no user found.",
    });
  }

  // 👇 Attach user to `ctx` object
  return await next({ user: user });
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure;
export const privateProcedure = publicProcedure.use(withAuth);

import { db } from "@/lib/db-client";
import { FREE_QUOTA, PRO_QUOTA } from "@/lib/quota";
import {
  CATEGORY_COLOR_VALIDATOR,
  CATEGORY_EMOJI_VALIDATOR,
  CATEGORY_NAME_VALIDATOR,
} from "@/lib/validators";
import { startOfMonth } from "date-fns";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import { j, privateProcedure } from "../jstack";

export const eventCategoryRouter = j.router({
  getAll: privateProcedure.query(async ({ c, ctx }) => {
    try {
      // Get all categories for the user
      const categories = await db.eventCategory.findMany({
        where: { userId: ctx.user.id },
      });

      // Calculate date boundaries once
      const firstDayOfMonth = startOfMonth(new Date());

      // Process categories in parallel
      const categoriesWithMetadata = await Promise.all(
        categories.map(async (category) => {
          const categoryId = category.id;

          const [uniqueFieldCount, eventsCount, lastPing] = await Promise.all([
            getUniqueFieldCount(categoryId, firstDayOfMonth),
            getEventsCount(categoryId, firstDayOfMonth),
            getLastPing(categoryId),
          ]);

          return {
            ...category,
            uniqueFieldCount,
            eventsCount,
            lastPing: lastPing?.createdAt || null,
          };
        })
      );

      return c.json({ eventCategories: categoriesWithMetadata });
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, {
        message: `sorry we have problem in our server.`,
      });
    }
  }),

  create: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        color: CATEGORY_COLOR_VALIDATOR,
        emoji: CATEGORY_EMOJI_VALIDATOR.optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      try {
        const count = await db.eventCategory.count({
          take: PRO_QUOTA.maxEventCategories,
          where: {
            userId: ctx.user.id,
          },
        });

        if (
          ctx.user.plan === "FREE" &&
          count >= FREE_QUOTA.maxEventCategories
        ) {
          throw new HTTPException(422, {
            message: "You have reached max event categories quota.",
          });
        }

        if (ctx.user.plan === "PRO" && count >= PRO_QUOTA.maxEventCategories) {
          throw new HTTPException(422, {
            message: "You have reached max event categories quota.",
          });
        }

        const eventCategory = await db.eventCategory.create({
          data: {
            name: input.name.toLowerCase(),
            color: input.color,
            emoji: input.emoji,
            userId: ctx.user.id,
          },
        });

        return c.json({ eventCategory });
      } catch (error) {
        if (error instanceof HTTPException) {
          throw error;
        }

        throw new HTTPException(500, {
          message: `sorry we have problem in our server.`,
        });
      }
    }),

  quickStart: privateProcedure.mutation(async ({ ctx, c }) => {
    try {
      const categories = await db.eventCategory.createMany({
        data: [
          { name: "bug", emoji: "🐛", color: "#ff6b6b" },
          { name: "sale", emoji: "💰", color: "#ffeb3b" },
          { name: "question", emoji: "🤔", color: "#6c5ce7" },
        ].map((category) => ({
          name: category.name,
          emoji: category.emoji,
          color: category.color,
          userId: ctx.user.id,
        })),
      });

      return c.json({ message: `created count ${categories.count}` });
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, {
        message: `sorry we have problem in our server.`,
      });
    }
  }),

  remove: privateProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      try {
        const category = await db.eventCategory.delete({
          where: { name_userId: { name: input.name, userId: ctx.user.id } },
        });
        return c.json({ message: `deleted ${category.id}` });
      } catch (error) {
        if (error instanceof HTTPException) {
          throw error;
        }

        throw new HTTPException(500, {
          message: `sorry we have problem in our server.`,
        });
      }
    }),
});

/* ---------------------------- utility --------------------------- */
async function getUniqueFieldCount(
  categoryId: string,
  fromDate: Date
): Promise<number> {
  const events = await db.event.findMany({
    where: {
      eventCategoryId: categoryId,
      createdAt: { gte: fromDate },
    },
    select: { fields: true },
    distinct: ["fields"],
  });

  // Use a more efficient approach to collect unique field names
  const fieldNames = new Set<string>();

  events.forEach((event) => {
    if (event.fields && typeof event.fields === "object") {
      Object.keys(event.fields).forEach((fieldName) => {
        fieldNames.add(fieldName);
      });
    }
  });

  return fieldNames.size;
}

async function getEventsCount(
  categoryId: string,
  fromDate: Date
): Promise<number> {
  return db.event.count({
    where: {
      eventCategoryId: categoryId,
      createdAt: { gte: fromDate },
    },
  });
}

async function getLastPing(
  categoryId: string
): Promise<{ createdAt: Date } | null> {
  return db.event.findFirst({
    where: { eventCategoryId: categoryId },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });
}

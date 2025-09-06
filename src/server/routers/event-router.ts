import { db } from "@/lib/db-client";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import { j, privateProcedure } from "../jstack";

export const eventRouter = j.router({
  getAllByCategoryName: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        page: z.number().min(1).max(1000),
        pageSize: z.number().max(50),
        filters: z.object({
          timeRange: z.enum(["today", "week", "month"]),
        }),
      })
    )
    .query(async ({ c, ctx, input }) => {
      try {
        const { name, page, pageSize, filters } = input;

        const now = new Date();
        let startDate: Date;

        switch (filters.timeRange) {
          case "today":
            startDate = startOfDay(now);
            break;
          case "week":
            startDate = startOfWeek(now, { weekStartsOn: 0 });
            break;
          case "month":
            startDate = startOfMonth(now);
            break;
        }

        const [events, totalEventCount, uniqueFieldCount] = await Promise.all([
          db.event.findMany({
            where: {
              eventCategory: { name, userId: ctx.user.id },
              createdAt: { gte: startDate },
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: "desc" },
          }),
          db.event.count({
            where: {
              eventCategory: { name, userId: ctx.user.id },
              createdAt: { gte: startDate },
            },
          }),
          db.event
            .findMany({
              where: {
                eventCategory: { name, userId: ctx.user.id },
                createdAt: { gte: startDate },
              },
              select: {
                fields: true,
              },
              distinct: ["fields"],
            })
            .then((events) => {
              const fieldNames = new Set<string>();
              events.forEach((event) => {
                Object.keys(event.fields as object).forEach((fieldName) => {
                  fieldNames.add(fieldName);
                });
              });
              return fieldNames.size;
            }),
        ]);

        return c.superjson({
          data: events,
          meta: {
            count: { record: totalEventCount, uniqueField: uniqueFieldCount },
          },
        });
      } catch (error) {
        if (error instanceof HTTPException) {
          throw error;
        }

        throw new HTTPException(500, {
          message: `sorry we have problem in our server.`,
        });
      }
    }),

  pollByCategoryName: privateProcedure
    .input(z.object({ name: CATEGORY_NAME_VALIDATOR }))
    .query(async ({ c, ctx, input }) => {
      try {
        const { name } = input;

        const now = new Date();
        const startOfThisMonth = startOfMonth(now);

        const event = await db.event.findFirst({
          where: {
            eventCategory: {
              name: name,
            },
            createdAt: {
              gte: startOfThisMonth,
            },
          },
        });

        return c.json({ hasEvent: !!event });
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

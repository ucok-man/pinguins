import { ApiError } from "@/app/api/api-error";
import { db } from "@/lib/db-client";
import { DiscordClient } from "@/lib/discord-client";
import { FREE_QUOTA, PRO_QUOTA } from "@/lib/quota";
import { colorHexToNumber } from "@/lib/utils";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators";
import { EventCategory, Plan } from "@prisma/client";
import to from "await-to-js";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const REQUEST_VALIDATOR = z
  .object({
    category: CATEGORY_NAME_VALIDATOR, // assume CATEGORY_NAME_VALIDATOR already has its own errors
    description: z
      .string({
        error: "Description must be a string",
      })
      .optional(),
    fields: z
      .record(
        z.string({
          error: "Field key must be a string",
        }),
        z.union([z.string(), z.number(), z.boolean()], {
          error:
            "fields must be object with value of string, number, or boolean and not contain nested object",
        })
      )
      .optional(),
  })
  .strict();

// Authentication helper
async function authenticateUser(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("INVALID_AUTH_HEADER");
  }

  const apikey = authHeader.split(" ")[1];
  if (!apikey || apikey.trim() === "") {
    throw new Error("INVALID_AUTH_HEADER");
  }

  const user = await db.user.findUnique({
    where: { apikey: apikey },
    include: { eventCategories: true },
  });

  if (!user) throw new Error("INVALID_AUTH_HEADER");
  if (!user.discordId) throw new Error("DISCORD_ID_NOT_SET");

  return user;
}

// Quota validation helper
async function validateQuota(userId: string, userPlan: Plan) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [err, quota] = await to(
    db.quota.findUnique({
      where: {
        userId,
        month: currentMonth,
        year: currentYear,
      },
    })
  );

  if (err) throw new Error(`QUOTA_FETCH_ERROR: ${err.message}`);

  if (!quota) {
    const [err] = await to(
      db.quota.create({
        data: {
          month: currentMonth,
          year: currentYear,
          userId: userId,
        },
      })
    );
    if (err) throw new Error(`QUOTA_CREATE_ERROR: ${err.message}`);
    return { currentMonth, currentYear };
  }

  const quotaLimit =
    userPlan === Plan.FREE
      ? FREE_QUOTA.maxEventsPerMonth
      : PRO_QUOTA.maxEventsPerMonth;

  if (quota && quota.count >= quotaLimit) {
    throw new Error("QUOTA_EXCEEDED");
  }

  return { currentMonth, currentYear };
}

// Request validation helper
async function validateRequest(req: NextRequest) {
  const [err, inputBody] = await to(req.json());
  if (err) throw new Error(`INVALID_JSON: ${err.message}`);

  const validation = REQUEST_VALIDATOR.safeParse(inputBody);
  if (validation.error) {
    const errs = z.flattenError(validation.error);
    throw new Error(`VALIDATION_ERROR: ${JSON.stringify(errs)}`);
  }

  return validation.data;
}

// Category validation helper
function validateCategory(
  eventCategories: EventCategory[],
  categoryName: string
) {
  const category = eventCategories.find(
    (ctgr: any) => ctgr.name === categoryName
  );

  if (!category) {
    throw new Error(`CATEGORY_NOT_FOUND: ${categoryName}`);
  }

  return category;
}

// Event data builder
function buildEventData(
  category: EventCategory,
  data: z.infer<typeof REQUEST_VALIDATOR>
) {
  return {
    title: `${category.emoji || "🔔"} ${
      category.name.charAt(0).toUpperCase() + category.name.slice(1)
    }`,
    description:
      data.description || `A new ${category.name} event has occurred!`,
    color: colorHexToNumber(category.color),
    timeStamp: new Date().toISOString(),
    fields: Object.entries(data.fields || {}).map(([key, val]) => ({
      name: key,
      value: String(val),
      inline: true,
    })),
  };
}

// Database event creation
async function saveEvent(
  userId: string,
  categoryId: string,
  categoryName: string,
  eventTitle: string,
  eventDescription: string,
  fields: any
) {
  const [err, event] = await to(
    db.event.create({
      data: {
        name: categoryName,
        formattedMessage: `${eventTitle}\n\n${eventDescription}`,
        fields: fields || {},
        userId,
        eventCategoryId: categoryId,
      },
    })
  );

  if (err) throw new Error(`EVENT_CREATION_ERROR: ${err}`);
  return event;
}

// Discord message sending
async function sendDiscordMessage(discordId: string, eventData: any) {
  const discord = new DiscordClient();
  const dmChannel = await discord.createDMChannel(discordId);

  const [err] = await to(discord.sendMessage(dmChannel.id, eventData));
  if (err) throw new Error(`DISCORD_SEND_ERROR: ${err}`);

  return true;
}

// Event delivery status update
async function updateEventDeliveryStatus(
  eventId: string,
  status: "DELIVERED" | "FAILED"
) {
  const [err] = await to(
    db.event.update({
      where: { id: eventId },
      data: { deliveryStatus: status },
    })
  );

  if (err) throw new Error(`EVENT_UPDATE_ERROR: ${err}`);
}

// Quota update
async function updateQuota(userId: string, month: number, year: number) {
  const [err] = await to(
    db.quota.upsert({
      where: { userId, month, year },
      update: { count: { increment: 1 } },
      create: {
        userId,
        month,
        year,
        count: 1,
      },
    })
  );

  if (err) throw new Error(`QUOTA_UPDATE_ERROR: ${err}`);
}

// Main API handler
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await authenticateUser(req);

    // 2. Validate quota
    const { currentMonth, currentYear } = await validateQuota(
      user.id,
      user.plan
    );

    // 3. Validate request body
    const dto = await validateRequest(req);

    // 4. Validate category exists
    const category = validateCategory(user.eventCategories, dto.category);

    // 5. Build event data
    const eventData = buildEventData(category, dto);

    // 6. Save event in database
    const event = await saveEvent(
      user.id,
      category.id,
      category.name,
      eventData.title,
      eventData.description,
      dto.fields
    );

    // 7. Send Discord message
    try {
      await sendDiscordMessage(user.discordId!, eventData);
      await updateEventDeliveryStatus(event.id, "DELIVERED");
    } catch (discordError) {
      await updateEventDeliveryStatus(event.id, "FAILED");
      throw discordError;
    }

    // 8. Update quota
    await updateQuota(user.id, currentMonth, currentYear);

    // 9. Return success response
    return NextResponse.json(
      { message: "Event processed successfully", eventId: event.id },
      { status: 201 }
    );
  } catch (error) {
    // Error handling
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    switch (true) {
      case errorMessage === "INVALID_AUTH_HEADER":
        return ApiError.unauthorized("invalid or missing authentication token");

      case errorMessage.startsWith("INVALID_JSON"):
        return ApiError.badRequest(errorMessage.split(": ")[1]!);

      case errorMessage.startsWith("CATEGORY_NOT_FOUND"):
        return ApiError.badRequest(
          `You don't have a category named ${errorMessage.split(": ")[1]}`
        );

      case errorMessage.startsWith("VALIDATION_ERROR"):
        return ApiError.unprocessableEntity(
          "invalid json body was provided",
          JSON.parse(errorMessage.split(": ")[1]!)
        );

      case errorMessage === "DISCORD_ID_NOT_SET":
        return ApiError.unprocessableEntity(
          "cannot proccess your request because your discord id are not connected"
        );

      case errorMessage === "QUOTA_EXCEEDED":
        return ApiError.unprocessableEntity(
          "monthly quota reached. please upgrade your plan for more events"
        );

      case errorMessage === "QUOTA_FETCH_ERROR":
        return ApiError.internalServer(
          new Error(errorMessage),
          "Error getting quota"
        );

      case errorMessage === "QUOTA_CREATE_ERROR":
        return ApiError.internalServer(
          new Error(errorMessage),
          "Error create quota"
        );

      case errorMessage === "EVENT_CREATION_ERROR":
        return ApiError.internalServer(
          new Error(errorMessage),
          "Error creating event"
        );

      case errorMessage === "DISCORD_SEND_ERROR":
        return ApiError.internalServer(
          new Error(errorMessage),
          "Error sending Discord message"
        );

      case errorMessage === "EVENT_UPDATE_ERROR":
        return ApiError.internalServer(
          new Error(errorMessage),
          "Error updating event"
        );

      case errorMessage === "QUOTA_UPDATE_ERROR":
        return ApiError.internalServer(
          new Error(errorMessage),
          "Error updating quota"
        );

      default:
        return ApiError.internalServer(
          new Error(errorMessage),
          "Unexpected error occurred"
        );
    }
  }
}

import { ApiError } from "@/app/api/api-error";
import { db } from "@/lib/db-client";
import { DiscordClient } from "@/lib/discord-client";
import { FREE_PLAN, PRO_PLAN } from "@/lib/quota";
import { colorHexToNumber } from "@/lib/utils";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators";
import { EventCategory, Plan } from "@prisma/client";
import to from "await-to-js";
import { addMonths, startOfMonth } from "date-fns";
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
  if (!user.discordId) throw new Error("DISCORD_INTEGRATION_NOT_SET");

  return user;
}

// Quota validation helper
async function validateQuota(userId: string, userPlan: Plan) {
  const startMonth = startOfMonth(new Date());
  const startNextMonth = startOfMonth(addMonths(startMonth, 1));

  const [err, eventCount] = await to(
    db.event.count({
      where: {
        userId: userId,
        createdAt: {
          gte: startMonth,
          lt: startNextMonth,
        },
      },
    })
  );
  if (err) throw new Error("FETCH_EVENT_COUNT");

  const eventLimit =
    userPlan === "PRO"
      ? PRO_PLAN.maxEventsPerMonth
      : FREE_PLAN.maxEventsPerMonth;

  if (eventCount >= eventLimit) {
    throw new Error("QUOTA_EXCEEDED");
  }
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

// Main API handler
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await authenticateUser(req);

    // 2. Validate quota
    await validateQuota(user.id, user.plan);

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

      case errorMessage === "DISCORD_INTEGRATION_NOT_SET":
        return ApiError.unprocessableEntity(
          "cannot proccess your request because integration discord not set"
        );

      case errorMessage === "QUOTA_EXCEEDED":
        return ApiError.unprocessableEntity(
          "monthly quota reached. please upgrade your plan for more events"
        );

      case errorMessage === "FETCH_EVENT_COUNT":
        return ApiError.internalServer(
          new Error(errorMessage),
          "Error fetching event"
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

      default:
        return ApiError.internalServer(
          new Error(errorMessage),
          "Unexpected error occurred"
        );
    }
  }
}

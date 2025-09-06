import { Event } from "@prisma/client";
import { isAfter, isToday, startOfMonth, startOfWeek } from "date-fns";
import { FieldSummaries } from "./types";

// Helper function to calculate numeric field summaries
export function calculateNumericFieldSummaries(
  events: Event[]
): FieldSummaries | null {
  if (!events || events.length === 0) return null;

  const summaries: FieldSummaries = {};
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 0 });
  const monthStart = startOfMonth(now);

  events.forEach((event) => {
    const eventDate = new Date(event.createdAt);
    const eventFields = event.fields as Record<string, any>;

    Object.entries(eventFields).forEach(([fieldName, fieldValue]) => {
      // Only process numeric fields
      if (typeof fieldValue !== "number") return;

      // Initialize field summary if it doesn't exist
      if (!summaries[fieldName]) {
        summaries[fieldName] = {
          total: 0,
          thisWeek: 0,
          thisMonth: 0,
          today: 0,
        };
      }

      // Add to total
      summaries[fieldName].total += fieldValue;

      // Add to week total if event is from this week
      if (
        isAfter(eventDate, weekStart) ||
        eventDate.getTime() === weekStart.getTime()
      ) {
        summaries[fieldName].thisWeek += fieldValue;
      }

      // Add to month total if event is from this month
      if (
        isAfter(eventDate, monthStart) ||
        eventDate.getTime() === monthStart.getTime()
      ) {
        summaries[fieldName].thisMonth += fieldValue;
      }

      // Add to today total if event is from today
      if (isToday(eventDate)) {
        summaries[fieldName].today += fieldValue;
      }
    });
  });

  return summaries;
}

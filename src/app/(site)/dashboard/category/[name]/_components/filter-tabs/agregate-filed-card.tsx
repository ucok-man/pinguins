import { Card } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { FieldSummaries, FieldSummary, TimeRangeFilter } from "./types";

type Props = {
  agregateData: FieldSummaries | null;
  activetab: TimeRangeFilter;
};

export function AgregateFieldCard({ agregateData, activetab }: Props) {
  // Don't render anything if no data
  if (!agregateData) {
    return null;
  }

  return (
    <>
      {Object.entries(agregateData).map(([fieldName, fieldSummary]) => (
        <FieldSummaryCard
          key={fieldName}
          fieldName={fieldName}
          fieldSummary={fieldSummary}
          timeRange={activetab}
        />
      ))}
    </>
  );
}

// Individual field summary card component
function FieldSummaryCard({
  fieldName,
  fieldSummary,
  timeRange,
}: {
  fieldName: string;
  fieldSummary: FieldSummary;
  timeRange: TimeRangeFilter;
}) {
  // Get the relevant sum based on selected time range
  const currentValue = getCurrentValueForTimeRange(fieldSummary, timeRange);

  // Format field name for display (capitalize first letter)
  const displayFieldName = capitalizeFirstLetter(fieldName);

  // Get time range label for description
  const timeRangeLabel = getTimeRangeLabel(timeRange);

  return (
    <Card>
      {/* Card header with field name and icon */}
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-small/6 font-medium">{displayFieldName}</p>
        <BarChart className="size-4 text-muted-foreground" />
      </div>

      {/* Card content with value and description */}
      <div>
        <p className="text-2xl font-bold">{formatNumber(currentValue)}</p>
        <p className="text-sx/5 text-muted-foreground">{timeRangeLabel}</p>
      </div>
    </Card>
  );
}

/**
 * Gets the appropriate value from field summary based on time range
 */
function getCurrentValueForTimeRange(
  fieldSummary: FieldSummary,
  timeRange: TimeRangeFilter
): number {
  switch (timeRange) {
    case "today":
      return fieldSummary.today;
    case "week":
      return fieldSummary.thisWeek;
    case "month":
      return fieldSummary.thisMonth;
    default:
      return fieldSummary.today;
  }
}

/**
 * Capitalizes the first letter of a string
 */
function capitalizeFirstLetter(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Gets user-friendly label for time range
 */
function getTimeRangeLabel(timeRange: TimeRangeFilter): string {
  switch (timeRange) {
    case "today":
      return "today";
    case "week":
      return "this week";
    case "month":
      return "this month";
    default:
      return "today";
  }
}

/**
 * Formats number for display (with 2 decimal places)
 */
function formatNumber(value: number): string {
  return value.toFixed(2);
}

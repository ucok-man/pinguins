export type FieldSummary = {
  total: number;
  thisWeek: number;
  thisMonth: number;
  today: number;
};
export type FieldSummaries = Record<string, FieldSummary>;

export type TimeRangeFilter = "today" | "week" | "month";

export const FREE_PLAN = {
  maxEventsPerMonth: 100,
  maxEventCategories: 3,
} as const;

export const PRO_PLAN = {
  maxEventsPerMonth: 10000,
  maxEventCategories: 10,
} as const;

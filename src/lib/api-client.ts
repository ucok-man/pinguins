import type { AppRouter } from "@/server";
import { createClient } from "jstack";

/**
 * Your type-safe API client
 * @see https://jstack.app/docs/backend/api-client
 */
export const api = createClient<AppRouter>({
  baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
});

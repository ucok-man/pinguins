// hooks/useUsage.ts
import { api } from "@/lib/api-client";
import { QueryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useUsage = () => {
  return useQuery({
    queryKey: [QueryKeys.PROJECT_USAGE],
    queryFn: async () => {
      const res = await api.project.usage.$get();
      return await res.json();
    },
  });
};

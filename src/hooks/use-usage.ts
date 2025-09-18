// hooks/useUsage.ts
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useUsage = () => {
  return useQuery({
    queryKey: ["usage"],
    queryFn: async () => {
      const res = await api.project.usage.$get();
      return await res.json();
    },
  });
};

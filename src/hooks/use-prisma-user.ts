import { api } from "@/lib/api-client";
import { QueryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function usePrismaUser(option?: { pollPlan: boolean }) {
  const user = useQuery({
    queryKey: [QueryKeys.AUTH_WHO_AM_I],
    queryFn: async () => {
      const res = await api.auth.whoami.$get();
      return await res.json();
    },
    refetchInterval: (query) => {
      if (!option?.pollPlan) return false;
      if (query.state.data?.plan === "PRO") return false;
      return 1000;
    },
  });
  return user;
}

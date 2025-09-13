import { api } from "@/lib/api-client";
import { QueryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function usePrismaUser() {
  const user = useQuery({
    queryKey: [QueryKeys.AUTH_WHO_AM_I],
    queryFn: async () => {
      const res = await api.auth.whoami.$get();
      return await res.json();
    },
  });
  return user;
}

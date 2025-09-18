import { api } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCheckout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const res = await api.payment.checkout.$post();
      return await res.json();
    },
    onSuccess: ({ session }) => {
      if (!session.url) {
        toast.error("Oops! something went wrong 🫣");
      } else {
        router.push(session.url);
      }
    },
    onError: () => {
      toast.error("Oops! something went wrong 🫣");
    },
  });
};

"use client";

import Spinner from "@/components/spinner";
import TextH1 from "@/components/text-h1";
import { api } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function WelcomePage() {
  const router = useRouter();

  const syncUser = useMutation({
    mutationFn: async () => {
      const res = await api.auth.syncUser.$post();
      return await res.json();
    },

    onSuccess: () => {
      router.push("/dashboard");
    },

    onError: () => {
      toast.error("Oops! something went wrong 🫣");
    },
  });

  useEffect(() => {
    syncUser.mutate();
  }, [router]);

  return (
    <div className="w-full flex-1 flex justify-center items-center px-4">
      <div className="z-10 flex flex-col items-center gap-4 text-center">
        <TextH1>Setting up your account...</TextH1>
        <p className="text-base/7 text-gray-600 max-w-prose">
          Just a moment while we set things up for you.
        </p>
        <Spinner />
      </div>
    </div>
  );
}

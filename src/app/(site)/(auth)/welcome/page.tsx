"use client";

import BgPattern from "@/components/bg-pattern";
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
    <div className="flex w-full flex-1 justify-center items-center px-4">
      <BgPattern className="absolute inset-0 left-1/2 z-0 -translate-x-1/2 opacity-75" />

      <div className="relative z-10 flex -translate-y-1/2 flex-col items-center gap-6 text-center">
        <Spinner />
        <TextH1>Setting up your account...</TextH1>
        <p className="text-base/7 text-gray-600 max-w-prose">
          Just a moment while we set things up for you.
        </p>
      </div>
    </div>
  );
}

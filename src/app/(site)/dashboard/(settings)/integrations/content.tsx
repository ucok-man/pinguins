"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import Icons from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePrismaUser } from "@/hooks/use-prisma-user";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Content() {
  const user = usePrismaUser();

  return (
    <div className="max-w-2xl w-full border-0 bg-gradient-to-br from-card to-card/50">
      <header className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-discord-brand-color">
              <Icons.discord className="size-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Discord Integration</CardTitle>
              <CardDescription>
                Connect your Discord account for notifications
              </CardDescription>
            </div>
          </div>
          <StatusBadge connected={Boolean(user.data?.discordId)} />
        </div>
      </header>

      <Separator />
    </div>
  );
}

function StatusBadge({ connected }: { connected: boolean }) {
  const router = useRouter();
  const connectDiscord = useMutation({
    mutationFn: async () => {
      const res = await api.auth.connectDiscord.$post();
      return await res.json();
    },
    onSuccess: ({ url }) => {
      router.push(url);
    },
    onError: () => {
      toast.error("Oops! something went wrong 🫣");
    },
  });

  return (
    <Badge
      variant="default"
      className={cn(
        "gap-1",
        !connected &&
          "cursor-pointer transition-all hover:bg-brand-primary-600/90"
      )}
      onClick={() => {
        if (connected) return;
        connectDiscord.mutate();
      }}
    >
      {connectDiscord.isPending ? (
        <>
          <Loader className="animate-spin" />
          Connecting
        </>
      ) : connected ? (
        <>
          <CheckIcon className="size-3" />
          Connected
        </>
      ) : (
        <>
          Connect
          <ArrowRight />
        </>
      )}
    </Badge>
  );
}

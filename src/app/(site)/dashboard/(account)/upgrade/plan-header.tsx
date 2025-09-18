// components/PlanHeader.tsx
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plan } from "@prisma/client";
import { Crown } from "lucide-react";

type Props = {
  plan: Plan;
  isLoading: boolean;
};

export default function PlanHeader({ plan, isLoading }: Props) {
  const isPro = plan === "PRO";

  if (isLoading) return <LoadingSkeleton />;

  return (
    <header className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Current Plan
        </h1>
        <Badge
          variant={isPro ? "default" : "secondary"}
          className={`flex items-center gap-1.5 px-3 py-1`}
        >
          {isPro && <Crown className="h-3 w-3" />}
          {isPro ? "Pro" : "Free"}
        </Badge>
      </div>

      <p className="text-muted-foreground max-w-2xl leading-relaxed">
        {isPro
          ? "Thank you for supporting Pinguins! You have access to increased usage limits and premium features."
          : "Upgrade to Pro to unlock more events, categories, and premium support with priority assistance."}
      </p>
    </header>
  );
}

function LoadingSkeleton() {
  return (
    <header className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Current Plan
        </h1>
        <Skeleton className="inline-block w-12 h-6" />
      </div>

      <Skeleton className="w-full h-4.5 max-w-2xl" />
      <Skeleton className="w-full h-4.5 max-w-xs" />
    </header>
  );
}

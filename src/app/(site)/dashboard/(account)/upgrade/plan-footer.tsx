// components/PlanFooter.tsx
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plan } from "@prisma/client";
import { format } from "date-fns";
import { Loader, Zap } from "lucide-react";

type Props = {
  plan: Plan;
  resetDate: Date;
  isLoadingUsage: boolean;
  onUpgrade: () => void;
  isUpgrading: boolean;
};

export default function PlanFooter({
  plan,
  resetDate,
  isLoadingUsage,
  onUpgrade,
  isUpgrading,
}: Props) {
  const isPro = plan === "PRO";

  if (isLoadingUsage) return <LoadingSkeleton />;

  return (
    <footer className="space-y-4 pt-4 border-t border-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Usage will reset on{" "}
            {resetDate ? (
              <span className="font-medium text-foreground">
                {format(new Date(resetDate), "MMM d, yyyy")}
              </span>
            ) : (
              <span className="text-muted-foreground">Unknown date</span>
            )}
          </p>
          {!isPro && (
            <p className="text-xs text-muted-foreground">
              Upgrade to Pro for higher limits and premium features
            </p>
          )}
        </div>

        {!isPro && (
          <Button
            onClick={onUpgrade}
            disabled={isUpgrading}
            className="flex items-center gap-2"
            size="sm"
          >
            {isUpgrading ? (
              <>
                <Loader className="size-4" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="size-4" />
                Upgrade to Pro
              </>
            )}
          </Button>
        )}
      </div>
    </footer>
  );
}

function LoadingSkeleton() {
  return (
    <footer className="space-y-4 pt-4 border-t border-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground flex items-center gap-1.5">
            <p>Usage will reset on</p>
            <Skeleton className="inline-block w-20 h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useCheckout } from "@/hooks/use-checkout";
import { usePrismaUser } from "@/hooks/use-prisma-user";
import { useUsage } from "@/hooks/use-usage";
import { Plan } from "@prisma/client";
import PlanFooter from "./plan-footer";
import PlanHeader from "./plan-header";
import UsageCard from "./usage-card";

export default function Content() {
  const user = usePrismaUser();
  const checkout = useCheckout();
  const usage = useUsage();

  const userPlan: Plan = user.data?.plan === "PRO" ? "PRO" : "FREE";

  const handleUpgradeClick = () => checkout.mutate();

  return (
    <div className="max-w-4xl space-y-8">
      <PlanHeader plan={userPlan} isLoading={user.isPending} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UsageCard
          title="Total Events"
          used={usage.data?.event.used ?? 0}
          limit={usage.data?.event.limit ?? 0}
          description="Events this billing period"
          isLoading={usage.isPending}
          hasError={!!usage.error}
        />

        <UsageCard
          title="Event Categories"
          used={usage.data?.category.used ?? 0}
          limit={usage.data?.category.limit ?? 0}
          description="Active categories"
          isLoading={usage.isPending}
          hasError={!!usage.error}
        />
      </div>

      <PlanFooter
        plan={userPlan}
        resetDate={usage.data?.event.resetDate ?? new Date()}
        isLoadingUsage={usage.isPending}
        onUpgrade={handleUpgradeClick}
        isUpgrading={checkout.isPending}
      />
    </div>
  );
}

// components/UsageCard.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart } from "lucide-react";

type UsageStatus = "low" | "medium" | "high" | "critical";

const USAGE_THRESHOLDS = {
  CRITICAL: 90,
  HIGH: 75,
  MEDIUM: 50,
} as const;

const USAGE_COLORS = {
  critical: {
    border: "border-destructive",
    bg: "bg-destructive",
    indicator: "bg-destructive",
  },
  high: {
    border: "border-orange-500",
    bg: "bg-orange-500",
    indicator: "bg-orange-500",
  },
  medium: {
    border: "border-border",
    bg: "bg-yellow-500",
    indicator: "bg-yellow-500",
  },
  low: {
    border: "border-border",
    bg: "bg-green-500",
    indicator: "bg-green-500",
  },
} as const;

const formatUsageText = (used: number, limit: number): string => {
  return `${used.toLocaleString()} of ${limit.toLocaleString()}`;
};

const getUsageStatus = (used: number, limit: number): UsageStatus => {
  const percentage = calculateUsagePercentage(used, limit);
  if (percentage >= USAGE_THRESHOLDS.CRITICAL) return "critical";
  if (percentage >= USAGE_THRESHOLDS.HIGH) return "high";
  if (percentage >= USAGE_THRESHOLDS.MEDIUM) return "medium";
  return "low";
};

const calculateUsagePercentage = (used: number, limit: number): number => {
  return Math.min((used / limit) * 100, 100);
};

type Props = {
  title: string;
  used: number;
  limit: number;
  description: string;
  isLoading: boolean;
  hasError: boolean;
};

export default function UsageCard({
  title,
  used,
  limit,
  description,
  isLoading,
  hasError,
}: Props) {
  const colors = USAGE_COLORS[getUsageStatus(used, limit)];
  const percentage = calculateUsagePercentage(used, limit);

  if (hasError) return <ErrorState title={title} />;
  if (isLoading) return <LoadingSkeleton title={title} />;

  return (
    <Card className={`transition-all duration-200 ${colors.border}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${colors.indicator}`} />
            <span className="text-xs text-muted-foreground">
              {percentage.toFixed(0)}% used
            </span>
          </div>
        </div>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p
            className="text-2xl font-bold"
            aria-label={`${used} ${title.toLowerCase()} used out of ${limit} limit`}
          >
            {formatUsageText(used, limit)}
          </p>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="w-full bg-secondary rounded-full h-2 mt-3">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${colors.bg}`}
              style={{ width: `${percentage}%` }}
              aria-label={`${percentage.toFixed(
                0
              )}% of ${title.toLowerCase()} limit used`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorState({ title }: { title: string }) {
  return (
    <Card className="border-border">
      <CardHeader>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-destructive/70 italic">
          Unable to load usage data
        </p>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton({ title }: { title: string }) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

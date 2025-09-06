import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "lucide-react";
import { AgregateFieldCard } from "./agregate-filed-card";
import { FieldSummaries, TimeRangeFilter } from "./types";

type Props = {
  activeTab: TimeRangeFilter;
  onTabChange: (tab: TimeRangeFilter) => void;
  eventsCount: number;
  numericFieldSummaries: FieldSummaries | null;
};

export default function FilterTabs({
  activeTab,
  onTabChange,
  eventsCount,
  numericFieldSummaries,
}: Props) {
  const getTimeRangeLabel = (timeRange: TimeRangeFilter): string => {
    switch (timeRange) {
      case "today":
        return "today";
      case "week":
        return "this week";
      case "month":
        return "this month";
      default:
        return "";
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as TimeRangeFilter)}
    >
      <TabsList className="mb-2">
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="week">This Week</TabsTrigger>
        <TabsTrigger value="month">This Month</TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {/* Total events card */}
          <Card className="border-2 border-brand-700">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-small/6 font-medium">Total Events</p>
              <BarChart className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{eventsCount}</p>
              <p className="text-sx/5 text-muted-foreground">
                Events {getTimeRangeLabel(activeTab)}
              </p>
            </div>
          </Card>

          {/* Aggregate field cards */}
          <AgregateFieldCard
            activetab={activeTab}
            agregateData={numericFieldSummaries}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "lucide-react";
import { TimeRangeFilter } from "./types";

type Props = {
  activeTab: TimeRangeFilter;
  onTabChange: (tab: TimeRangeFilter) => void;
  summary: {
    recordCount: number;
    uniqueFieldCount: number;
    numericFieldSum: Record<string, number>;
  };
};

export default function FilterTabs({ activeTab, onTabChange, summary }: Props) {
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

  const numericFieldSums = Object.entries(summary.numericFieldSum);
  const hasNumericFieldSum = !!numericFieldSums.length;

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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <h3 className="text-sm font-medium text-muted-foreground">
                Events
              </h3>

              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{summary.recordCount}</p>
                <p className="text-sm text-muted-foreground">{`Total events ${getTimeRangeLabel(
                  activeTab
                )}`}</p>
              </div>
            </CardContent>
          </Card>

          {/* Unique field count cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Fields
              </h3>

              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{summary.uniqueFieldCount}</p>
                <p className="text-sm text-muted-foreground">{`Total field for this event category`}</p>
              </div>
            </CardContent>
          </Card>

          {/* Sum numeric field cards */}
          {hasNumericFieldSum && (
            <>
              {numericFieldSums.map(([key, sum]) => (
                <Card key={key}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Total {capitalizeFirstLetter(key)} Field
                    </h3>

                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">{sum.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{`Total ${key} field value ${getTimeRangeLabel(
                        activeTab
                      )}`}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}

function capitalizeFirstLetter(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

import { BarChart2, Clock, Database } from "lucide-react";

type Props = {
  lastPing: string;
  uniqueFieldCount: number;
  eventsCount: number;
};

export default function CategoryStats({
  lastPing,
  uniqueFieldCount,
  eventsCount,
}: Props) {
  const stats = [
    { icon: Clock, label: "Last ping:", value: lastPing },
    { icon: Database, label: "Unique fields:", value: uniqueFieldCount || 0 },
    { icon: BarChart2, label: "Events this month:", value: eventsCount || 0 },
  ];

  return (
    <div className="space-y-3 mb-6">
      {stats.map(({ icon: Icon, label, value }, index) => (
        <div key={index} className="flex items-center text-sm/5 text-gray-600">
          <Icon className="size-4 mr-2 text-brand-500" />
          <span className="font-medium">{label}</span>
          <span className="ml-1">{value}</span>
        </div>
      ))}
    </div>
  );
}

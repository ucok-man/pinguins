import { formatEventCategoryName } from "@/lib/utils";
import { format } from "date-fns";

type Props = {
  category: {
    uniqueFieldCount: number;
    eventsCount: number;
    lastPing: string | null;
    name: string;
    id: string;
    color: string;
    emoji: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
  };
};

export default function CategoryHeader({ category }: Props) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div
        className="size-12 rounded-full"
        style={{ backgroundColor: category.color }}
      />
      <div>
        <h3 className="text-lg/7 font-medium tracking-tight text-gray-950">
          {category.emoji || "🐧"} {formatEventCategoryName(category.name)}
        </h3>
        <p className="text-sm/6 text-gray-600">
          {format(category.createdAt, "MMM d, yyyy")}
        </p>
      </div>
    </div>
  );
}

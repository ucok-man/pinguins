import { formatDistanceToNow } from "date-fns";
import CategoryActions from "./category-actions";
import CategoryHeader from "./category-header";
import CategoryStats from "./category-stats";

type CategoryCardProps = {
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
  onDeleteClick: (categoryName: string) => void;
};

export default function CategoryCard({
  category,
  onDeleteClick,
}: CategoryCardProps) {
  const lastPingText = category.lastPing
    ? `${formatDistanceToNow(category.lastPing)} ago`
    : "Never";

  return (
    <li className="relative group z-10 transition-all duration-200 hover:-translate-y-0.5">
      <div className="absolute z-0 inset-px rounded-lg bg-card" />
      <div className="pointer-events-none z-0 absolute inset-px rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md ring-1 ring-black/5" />

      <div className="relative p-6 z-10">
        <CategoryHeader category={category} />

        <CategoryStats
          lastPing={lastPingText}
          uniqueFieldCount={category.uniqueFieldCount}
          eventsCount={category.eventsCount}
        />

        <CategoryActions
          categoryName={category.name}
          onDeleteClick={onDeleteClick}
        />
      </div>
    </li>
  );
}

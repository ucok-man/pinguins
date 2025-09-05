import CategoryCard from "./category-card";

type Props = {
  categories: {
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
  }[];
  onDeleteClick: (categoryName: string) => void;
};

export default function CategoriesGrid({ categories, onDeleteClick }: Props) {
  return (
    <ul className="grid max-w-6xl grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </ul>
  );
}

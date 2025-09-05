import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";

type Props = {
  categoryName: string;
  onDeleteClick: (categoryName: string) => void;
};

export default function CategoryActions({
  categoryName,
  onDeleteClick,
}: Props) {
  return (
    <div className="flex items-center justify-between mt-4">
      <Link
        href={`/dashboard/category/${categoryName}`}
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "flex items-center gap-2 text-sm",
        })}
      >
        View All <ArrowRight className="size-4" />
      </Link>

      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-red-600 transition-colors"
        aria-label={`Delete ${categoryName} category`}
        onClick={() => onDeleteClick(categoryName)}
      >
        <Trash2 className="size-5" />
      </Button>
    </div>
  );
}

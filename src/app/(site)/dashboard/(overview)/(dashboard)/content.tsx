"use client";

import ThreeDotLoader from "@/components/three-dot-loader";
import { api } from "@/lib/api-client";
import { QueryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import CategoriesGrid from "./_components/categories-grid";
import DeleteEventCategoryModal from "./_components/delete-event-category-modal";
import EmptyState from "./_components/empty-state";

export default function Content() {
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Queries and mutations
  const eventCategories = useQuery({
    queryKey: [QueryKeys.EVENT_CATEGORY_GET_ALL],
    queryFn: async () => {
      const res = await api.eventCategory.getAll.$get();
      const { eventCategories } = await res.json();
      return eventCategories;
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (name: string) => {
      await api.eventCategory.remove.$post({ name });
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [QueryKeys.EVENT_CATEGORY_GET_ALL],
      });
      setDeletingCategory(null);
    },
  });

  // Event handlers
  const handleDeleteClick = (categoryName: string) => {
    setDeletingCategory(categoryName);
  };

  const handleDeleteConfirm = () => {
    if (deletingCategory) {
      deleteCategory.mutate(deletingCategory);
    }
  };

  const handleCloseDialog = () => {
    setDeletingCategory(null);
  };

  const hasCategories = eventCategories.data && eventCategories.data.length > 0;
  const isDialogOpen = deletingCategory !== null;

  if (eventCategories.isPending) {
    return (
      <div className="size-full flex flex-col items-center justify-center space-y-2">
        <p className="text-secondary-500 animate-pulse">
          preparing resource...
        </p>
        <ThreeDotLoader size="md" />
      </div>
    );
  }

  return (
    <div className="size-full">
      {hasCategories ? (
        <CategoriesGrid
          categories={eventCategories.data}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <EmptyState />
      )}

      <DeleteEventCategoryModal
        isOpen={isDialogOpen}
        categoryName={deletingCategory}
        isDeleting={deleteCategory.isPending}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

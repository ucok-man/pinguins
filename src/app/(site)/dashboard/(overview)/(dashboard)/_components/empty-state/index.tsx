"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api-client";
import { QueryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import CreateEventCategoryModal from "../create-event-category-modal";

export default function EmptyState() {
  const queryClient = useQueryClient();

  const { mutate: handleInsertQuickstartCategories, isPending } = useMutation({
    mutationFn: async () => {
      await api.eventCategory.quickStart.$post();
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [QueryKeys.EVENT_CATEGORY_GET_ALL],
      });
    },
  });

  return (
    <Card className="size-full flex flex-col items-center justify-center rounded-2xl text-center gap-0">
      <div className="flex justify-center w-full">
        <Image
          src="/brand-asset-wave.png"
          alt="No categories"
          className="size-48 -mt-24"
          width={500}
          height={500}
        />
      </div>

      <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-brand-secondary-800">
        No Event Categories Yet
      </h1>

      <p className="text-sm/6 text-gray-600 max-w-prose mt-2 mb-8">
        Start tracking events by creating your first category.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button
          variant="outline"
          className="flex items-center space-x-2 w-full sm:w-auto"
          onClick={() => handleInsertQuickstartCategories()}
          disabled={isPending}
        >
          <span className="size-5">🚀</span>
          <span>{isPending ? "Creating..." : "Quickstart"}</span>
        </Button>

        <CreateEventCategoryModal>
          <Button className="flex items-center space-x-2 w-full sm:w-auto">
            <span>Add Category</span>
          </Button>
        </CreateEventCategoryModal>
      </div>
    </Card>
  );
}

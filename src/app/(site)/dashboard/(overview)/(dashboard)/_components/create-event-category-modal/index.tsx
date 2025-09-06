"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CATEGORY_COLOR_VALIDATOR,
  CATEGORY_EMOJI_VALIDATOR,
  CATEGORY_NAME_VALIDATOR,
} from "../../../../../../../lib/validators";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { QueryKeys } from "@/lib/query-keys";
import { COLOR_OPTIONS } from "./color-option";
import ColorSelector from "./color-selector";
import EmojiSelector from "./emoji-selector";

// Form schema
const eventCategoryFormSchema = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: CATEGORY_COLOR_VALIDATOR,
  emoji: CATEGORY_EMOJI_VALIDATOR.optional(),
});

type EventCategoryForm = z.infer<typeof eventCategoryFormSchema>;

type Props = {
  children: React.ReactNode;
};

export default function CreateEventCategoryModal({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<EventCategoryForm>({
    resolver: zodResolver(eventCategoryFormSchema),
    defaultValues: {
      name: "",
      color: COLOR_OPTIONS[0].value,
      emoji: undefined,
    },
  });

  const { handleSubmit, control, reset } = form;

  // Close modal and reset form
  const handleModalOpen = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        reset();
      }
    },
    [reset]
  );

  // Create category mutation
  const createCategory = useMutation({
    mutationFn: async (data: EventCategoryForm) => {
      const res = await api.eventCategory.create.$post(data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [QueryKeys.EVENT_CATEGORY_GET_ALL],
      });
      handleModalOpen(false);
    },
  });

  const onSubmit = useCallback((data: EventCategoryForm) => {
    createCategory.mutate(data);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Event Category</DialogTitle>
          <DialogDescription>
            Create a new category to organize your events. Choose a name, color,
            and optional emoji.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Name Field */}
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. user-signup, payment-received"
                        {...field}
                        autoFocus
                      />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for your event category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Color Field */}
              <FormField
                control={control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <ColorSelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a color to help identify this category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Emoji Field */}
              <FormField
                control={control}
                name="emoji"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emoji (Optional)</FormLabel>
                    <FormControl>
                      <EmojiSelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Add an emoji to make your category more visual.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleModalOpen(false)}
                disabled={createCategory.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createCategory.isPending}>
                {createCategory.isPending ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

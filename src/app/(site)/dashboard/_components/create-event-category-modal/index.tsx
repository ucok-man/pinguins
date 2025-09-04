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
} from "./validators";

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
import { COLOR_OPTIONS } from "./color-option";
import ColorSelector from "./color-selector";
import EmojiSelector from "./emoji-selector";

// Constants moved outside component to prevent recreation on every render

// Form schema
const eventCategoryFormSchema = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: CATEGORY_COLOR_VALIDATOR,
  emoji: CATEGORY_EMOJI_VALIDATOR.optional(),
});

type EventCategoryForm = z.infer<typeof eventCategoryFormSchema>;

type Props = {
  children: React.ReactNode;
  onSuccess?: (data: EventCategoryForm) => void;
  onError?: (error: Error) => void;
};

export default function CreateEventCategoryModal({
  children,
  onSuccess,
  onError,
}: Props) {
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
  const handleCloseModal = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        reset();
      }
    },
    [reset]
  );

  // TODO: implement this call!
  // Create category mutation
  const { mutate: createEventCategory, isPending } = useMutation({
    mutationFn: async (data: EventCategoryForm) => {
      // TODO: Replace with actual API call
      // await api.category.createEventCategory.$post(data);
      console.log("Creating category:", data);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate potential error (remove in production)
      if (Math.random() > 0.8) {
        throw new Error("Failed to create category");
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user-event-categories"],
      });
      onSuccess?.(data);
      handleCloseModal(false);
    },
    onError: (error: Error) => {
      console.error("Failed to create category:", error);
      onError?.(error);
      // Keep modal open on error so user can retry
    },
  });

  const onSubmit = useCallback(
    (data: EventCategoryForm) => {
      createEventCategory(data);
    },
    [createEventCategory]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
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
                onClick={() => handleCloseModal(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
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

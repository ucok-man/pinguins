"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";
import { PropsWithChildren } from "react";
import { toast } from "sonner";

export default function Providers({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        onError(err, variables, context) {
          if (err instanceof HTTPException && err.status < 500) {
            toast.error(err.message);
          } else {
            toast.error("Oops! something went wrong 🫣");
          }
        },
      },
    },
  });

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ClerkProvider>
  );
}

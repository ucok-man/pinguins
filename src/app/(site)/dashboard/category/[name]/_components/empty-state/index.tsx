"use client";

import { Card } from "@/components/ui/card";
import { api } from "@/lib/api-client";
import { QueryKeys } from "@/lib/query-keys";
import { exampleFetchCodeSnippet, formatEventCategoryName } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  eventCategoryName: string;
};

export default function EmptyState({ eventCategoryName }: Props) {
  const router = useRouter();

  // Generate code snippet with the actual category name
  const codeSnippet = exampleFetchCodeSnippet(eventCategoryName);

  // Poll for events - when events are detected, refresh the page
  const { data: pollData } = useQuery({
    queryKey: [QueryKeys.EVENT_POLL_BY_CATEGORY_NAME, eventCategoryName],
    queryFn: async () => {
      const response = await api.event.pollByCategoryName.$get({
        name: eventCategoryName,
      });
      return await response.json();
    },
    // Keep polling every second until events are found
    refetchInterval: (query) => {
      return query.state.data?.hasEvent ? false : 1000;
    },
  });

  // Refresh page when events are detected
  useEffect(() => {
    if (pollData?.hasEvent) {
      router.refresh();
    }
  }, [pollData?.hasEvent, router]);

  return (
    <div className="size-full">
      <Card className="max-w-7xl w-full flex flex-col justify-center items-center p-6 mx-auto">
        {/* Header section */}
        <EmptyStateHeader categoryName={eventCategoryName} />

        {/* Code example section */}
        <CodeExampleSection codeSnippet={codeSnippet} />

        {/* Status and help section */}
        <StatusAndHelpSection />
      </Card>
    </div>
  );
}

// Header component for the empty state
function EmptyStateHeader({ categoryName }: { categoryName: string }) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl/8 font-medium text-center tracking-tight text-brand-secondary-800">
        Create your first {formatEventCategoryName(categoryName)} event
      </h2>
      <p className="text-sm/6 text-brand-secondary-600 mb-8 max-w-md text-center text-pretty">
        Get Started by sending a request to our tracking API:
      </p>
    </div>
  );
}

// Code example section component
function CodeExampleSection({ codeSnippet }: { codeSnippet: string }) {
  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Terminal header with colored dots */}
      <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="size-3 rounded-full bg-red-500" />
          <div className="size-3 rounded-full bg-yellow-500" />
          <div className="size-3 rounded-full bg-green-500" />
        </div>
        <span className="text-gray-400 text-sm">example.js</span>
      </div>

      {/* Code syntax highlighter */}
      <SyntaxHighlighter
        language="javascript"
        style={oneDark}
        customStyle={{
          borderRadius: "0px",
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          overflow: "scroll",
        }}
      >
        {codeSnippet}
      </SyntaxHighlighter>
    </div>
  );
}

// Status and help links section
function StatusAndHelpSection() {
  return (
    <div className="mt-8 flex flex-col items-center space-x-2">
      {/* Listening status indicator */}
      <div className="flex gap-2 items-center">
        <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-600">
          Listening to incoming events...
        </span>
      </div>

      {/* Help links */}
      <p className="text-sm text-gray-600 mt-4 text-center max-md:leading-tight">
        Need help? Check out our{" "}
        <a href="#" className="text-blue-600 hover:underline">
          documentation
        </a>{" "}
        or{" "}
        <a href="#" className="text-blue-600 hover:underline">
          contact support
        </a>
        .
      </p>
    </div>
  );
}

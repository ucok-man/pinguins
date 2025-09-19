"use client";

import { api } from "@/lib/api-client";
import { QueryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import EmptyState from "./_components/empty-state";
// import EventTable from "./_components/event-table";
// import { createColumnDefinition } from "./_components/event-table/create-columns-definition";
import ThreeDotLoader from "@/components/three-dot-loader";
import { toast } from "sonner";
import EventTable from "./_components/event-table";
import { createColumnDefinition } from "./_components/event-table/create-columns-definition";
import FilterTabs from "./_components/filter-tabs";
import { TimeRangeFilter } from "./_components/filter-tabs/types";

type Props = {
  eventCategoryName: string;
};

export default function Content({ eventCategoryName }: Props) {
  // Extract URL parameters for pagination
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = parseInt(searchParams.get("pageSize") || "10", 10);

  // Component state
  const [paginationState, setPaginationState] = useState({
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  const [activeTimeRange, setActiveTimeRange] =
    useState<TimeRangeFilter>("today");

  // Fetch events data based on current filters and pagination
  const {
    data: events,
    isFetching,
    isError,
    isPending,
  } = useQuery({
    queryKey: [
      QueryKeys.EVENT_GET_ALL_BY_CATEGORY_NAME,
      eventCategoryName,
      paginationState.pageIndex,
      paginationState.pageSize,
      activeTimeRange,
    ],
    queryFn: async () => {
      const response = await api.event.getAllByCategoryName.$get({
        name: eventCategoryName,
        page: paginationState.pageIndex + 1,
        pageSize: paginationState.pageSize,
        filters: {
          timeRange: activeTimeRange,
        },
      });
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Oops! something went wrong 🫣");
    }
  }, [isError]);

  if (isPending) {
    return (
      <div className="size-full flex flex-col items-center justify-center space-y-2">
        <p className="text-secondary-500 animate-pulse">
          Preparing resources...
        </p>
        <ThreeDotLoader size="md" />
      </div>
    );
  }

  // Show empty state if no events exist
  if (!events?.data) {
    return <EmptyState eventCategoryName={eventCategoryName} />;
  }

  return (
    <div className="space-y-6 size-full">
      {/* Time range tabs */}
      <FilterTabs
        activeTab={activeTimeRange}
        onTabChange={setActiveTimeRange}
        summary={events.summary}
      />

      {/* Events table section */}
      <EventTable
        columns={createColumnDefinition(events?.data, eventCategoryName)}
        data={events?.data ?? []}
        dataCount={events?.summary.recordCount ?? 0}
        isLoading={isFetching}
        paginationState={paginationState}
        onPaginationChange={setPaginationState}
        pageSize={paginationState.pageSize}
      />
    </div>
  );
}

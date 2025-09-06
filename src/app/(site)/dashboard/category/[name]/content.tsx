"use client";

import { api } from "@/lib/api-client";
import { QueryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import EmptyState from "./_components/empty-state";
import EventTable from "./_components/event-table";
import { createColumnDefinition } from "./_components/event-table/create-columns-definition";
import FilterTabs from "./_components/filter-tabs";
import { calculateNumericFieldSummaries } from "./_components/filter-tabs/calculate-numeric-field-summary";
import { TimeRangeFilter } from "./_components/filter-tabs/types";

type Props = {
  eventCategoryName: string;
};

export default function Content({ eventCategoryName }: Props) {
  // Extract URL parameters for pagination
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = parseInt(searchParams.get("pageSize") || "30", 10);

  // Component state
  const [paginationState, setPaginationState] = useState({
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });
  const [activeTimeRange, setActiveTimeRange] =
    useState<TimeRangeFilter>("today");

  // Fetch events data based on current filters and pagination
  const { data: events, isFetching: isLoadingEvents } = useQuery({
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

  // Show empty state if no events exist
  if (!events?.data.length) {
    return <EmptyState eventCategoryName={eventCategoryName} />;
  }

  return (
    <div className="space-y-6 size-full">
      {/* Time range tabs */}
      <FilterTabs
        activeTab={activeTimeRange}
        onTabChange={setActiveTimeRange}
        eventsCount={events?.meta.count.record ?? 0}
        numericFieldSummaries={calculateNumericFieldSummaries(
          events?.data ?? []
        )}
      />

      {/* Events table section */}
      <EventTable
        columns={createColumnDefinition(events?.data, eventCategoryName)}
        data={events?.data ?? []}
        dataCount={events?.meta.count.record ?? 0}
        isLoading={isLoadingEvents}
        paginationState={paginationState}
        onPaginationChange={setPaginationState}
        pageSize={paginationState.pageSize}
      />
    </div>
  );
}

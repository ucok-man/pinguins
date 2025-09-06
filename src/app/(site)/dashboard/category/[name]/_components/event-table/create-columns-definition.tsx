import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DeliveryStatus, Event } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export function createColumnDefinition(
  events: Event[] | undefined,
  categoryName: string
): ColumnDef<Event>[] {
  const baseColumns: ColumnDef<Event>[] = [
    {
      accessorKey: "category",
      header: "Category",
      cell: () => <span>{categoryName || "Uncategorized"}</span>,
    },
    {
      accessorKey: "category",
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
    },
  ];
  // Add dynamic columns based on event fields
  const dynamicColumns: ColumnDef<Event>[] = events?.[0]
    ? Object.keys(events[0].fields as object).map((fieldName) => ({
        accessorFn: (row: Event) =>
          (row.fields as Record<string, any>)[fieldName],
        header: fieldName,
        cell: ({ row }: { row: Row<Event> }) =>
          (row.original.fields as Record<string, any>)[fieldName] || "-",
      }))
    : [];
  const statusColumn: ColumnDef<Event>[] = [
    {
      accessorKey: "deliveryStatus",
      header: "Delivery Status",
      cell: ({ row }) => {
        const status = row.getValue<DeliveryStatus>("deliveryStatus");
        return (
          <span
            className={cn("px-2 py-1 rounded-full text-xs font-semibold", {
              "bg-green-100 text-green-800": status === "DELIVERED",
              "bg-red-100 text-red-800": status === "FAILED",
              "bg-yellow-100 text-yellow-800": status === "PENDING",
            })}
          >
            {status}
          </span>
        );
      },
    },
  ];
  return [...baseColumns, ...dynamicColumns, ...statusColumn];
}

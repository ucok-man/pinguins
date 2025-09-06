import TextH1 from "@/components/text-h1";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import PaginationControls from "./pagination-control";

type Props<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  isLoading: boolean;
  dataCount: number;
  pageSize: number;
  onPaginationChange: OnChangeFn<PaginationState>;
  paginationState: {
    pageIndex: number;
    pageSize: number;
  };
};
export default function EventTable<TData, TValue>({
  data,
  columns,
  isLoading,
  dataCount,
  pageSize,
  onPaginationChange,
  paginationState,
}: Props<TData, TValue>) {
  const [sortingState, setSortingState] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSortingState,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(dataCount / pageSize),
    onPaginationChange: onPaginationChange,
    state: {
      sorting: sortingState,
      columnFilters,
      pagination: paginationState,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="w-full flex flex-col gap-4">
          <TextH1 className="text-3xl">Event overview</TextH1>
        </div>
      </div>

      <Card className="px-6 py-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <>
                {[...Array(5)].map((_, rowidx) => (
                  <TableRow key={rowidx}>
                    {columns.map((_, cellidx) => (
                      <TableCell key={cellidx}>
                        <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : !table.getRowModel().rows?.length ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              <>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </Card>

      <PaginationControls table={table} isLoading={isLoading} />
    </div>
  );
}

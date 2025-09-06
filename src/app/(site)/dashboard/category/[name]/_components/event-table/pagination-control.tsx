import { Button } from "@/components/ui/button";

export default function PaginationControls({
  table,
  isLoading,
}: {
  table: any;
  isLoading: boolean;
}) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage() || isLoading}
      >
        Prev
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage() || isLoading}
      >
        Next
      </Button>
    </div>
  );
}

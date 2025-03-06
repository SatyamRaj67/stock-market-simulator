import React from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Stock } from "@/lib/types";

interface StockTablePaginationProps {
  table: Table<Stock>;
  totalItems: number;
}

export const StockTablePagination: React.FC<StockTablePaginationProps> = ({
  table,
  totalItems,
}) => {
  const { pageIndex, pageSize } = table.getState().pagination;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing{" "}
        <strong>
          {startItem}-{endItem}
        </strong>{" "}
        of <strong>{totalItems}</strong>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

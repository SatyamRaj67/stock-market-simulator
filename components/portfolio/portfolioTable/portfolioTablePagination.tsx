import React, { useState, useEffect } from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionsPaginationProps<TData> {
  table: Table<TData>;
  totalItems?: number; 
}

export default function PortfolioTablePagination<TData>({
  table,
  totalItems, // Accept total items count
}: TransactionsPaginationProps<TData>) {
  // Create a local state to prevent too many renders
  const [pageIndex, setPageIndex] = useState(
    table.getState().pagination.pageIndex,
  );
  const [pageSize, setPageSize] = useState(
    table.getState().pagination.pageSize,
  );

  // Sync the local state with the table state
  useEffect(() => {
    const { pageIndex, pageSize } = table.getState().pagination;
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  }, [table]);

  // Update page size with debounce
  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    setPageSize(newSize);
    // Use setTimeout to debounce the actual table update
    setTimeout(() => {
      table.setPageSize(newSize);
    }, 0);
  };

  // Update page index with debounce
  const goToPage = (index: number) => {
    setPageIndex(index);
    // Use setTimeout to debounce the actual table update
    setTimeout(() => {
      table.setPageIndex(index);
    }, 0);
  };

  // Calculate range information
  const total = totalItems || table.getCoreRowModel().rows.length;
  const rangeStart = pageIndex * pageSize + 1;
  const rangeEnd = Math.min(rangeStart + pageSize - 1, total);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-2 py-4">
      {/* Add the range display */}
      <div className="text-sm text-muted-foreground mb-4 md:mb-0">
        Showing {rangeStart}-{rangeEnd} out of {total} transactions
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pageIndex + 1} of {table.getPageCount() || 1}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => goToPage(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronLeft className="h-4 w-4" />|
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => goToPage(pageIndex - 1)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => goToPage(pageIndex + 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => goToPage(Math.max(0, table.getPageCount() - 1))}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            |<ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

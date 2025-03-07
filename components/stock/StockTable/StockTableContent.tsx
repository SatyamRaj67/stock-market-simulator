"use client";

import React, { useState } from "react";
import { Table } from "@/components/ui/table";
import {
  SortingState,
  getPaginationRowModel,
  getSortedRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { usePathname } from "next/navigation";
import { Stock } from "@/lib/types";
import { getStockColumns } from "./StockTableColumns";
import { StockTableHeader } from "./StockTableHeader";
import { StockTableBody } from "./StockTableBody";
import { StockTablePagination } from "./StockTablePagination";

interface StockTableProps {
  stocks: Stock[];
  onEdit?: (stock: Stock) => void;
  onDelete?: (stockId: string) => void;
  showActions?: boolean;
  showTrading?: boolean;
  isLoading?: boolean;
}

const StockTableContent = ({
  stocks,
  onEdit,
  onDelete,
  showActions: explicitShowActions,
  showTrading = false,
  isLoading = false,
}: StockTableProps) => {
  const pathname = usePathname();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const showActions =
    explicitShowActions !== undefined
      ? explicitShowActions
      : pathname?.startsWith("/admin");

  // Pass showTrading to getStockColumns
  const columns = getStockColumns(showActions, showTrading, onEdit, onDelete);

  const table = useReactTable({
    data: stocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4 p-4 pt-8">
      <div className="rounded-md border">
        <Table>
          <StockTableHeader headerGroups={table.getHeaderGroups()} />
          <StockTableBody
            rows={table.getRowModel().rows}
            isLoading={isLoading}
            columnsLength={columns.length}
          />
        </Table>
      </div>

      <StockTablePagination table={table} totalItems={stocks.length} />
    </div>
  );
};

export default StockTableContent;

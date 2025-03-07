import React, { useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  PaginationState,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, SortAsc, SortDesc } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Transaction, TransactionType } from "@/lib/types";
import PortfolioTablePagination from "./portfolioTablePagination";
import { useQuery } from "@tanstack/react-query";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const columnHelper = createColumnHelper<Transaction>();

export default function PortfolioTableContent({
  transactions,
  isLoading = false,
}: TransactionsTableProps) {
  const userId = transactions[0]?.userId;

  const [sorting, setSorting] = useState<SortingState>([
    { id: "timestamp", desc: true },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Refetch the data when pagination changes
  useQuery({
    queryKey: [
      "transactions",
      userId,
      pagination.pageIndex,
      pagination.pageSize,
    ],
    queryFn: async () => {
      if (!userId) return null;

      const res = await fetch(
        `/api/transactions?page=${pagination.pageIndex}&limit=${pagination.pageSize}`,
      );
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
    enabled: !!userId && !isLoading,
  });

  const columns = [
    columnHelper.accessor("type", {
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Type
            <span className="ml-2">
              {column.getIsSorted() === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 opacity-50" />
              )}
            </span>
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={
            row.original.type === TransactionType.BUY ? "text-green-600" : "text-red-600"
          }
        >
          {row.original.type}
        </div>
      ),
    }),
    columnHelper.accessor("stock", {
      header: "Stock",
      cell: ({ row }) => (
        <div>
          {row.original.stock?.name} ({row.original.stock?.symbol})
        </div>
      ),
    }),
    columnHelper.accessor("quantity", {
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Quantity
            <span className="ml-2">
              {column.getIsSorted() === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 opacity-50" />
              )}
            </span>
          </Button>
        </div>
      ),
    }),
    columnHelper.accessor("price", {
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Price
            <span className="ml-2">
              {column.getIsSorted() === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 opacity-50" />
              )}
            </span>
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div>${parseFloat(row.original.price.toString()).toFixed(2)}</div>
      ),
    }),
    columnHelper.accessor("totalAmount", {
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Total
            <span className="ml-2">
              {column.getIsSorted() === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 opacity-50" />
              )}
            </span>
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div>${parseFloat(row.original.totalAmount.toString()).toFixed(2)}</div>
      ),
    }),
    columnHelper.accessor("timestamp", {
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Date
            <span className="ml-2">
              {column.getIsSorted() === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 opacity-50" />
              )}
            </span>
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div>
          {formatDistanceToNow(new Date(row.original.timestamp), {
            addSuffix: true,
          })}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
      pagination,
    },
    manualPagination: true,
    pageCount:
      transactions.length > 0
        ? Math.ceil(transactions.length / pagination.pageSize)
        : 0,
    enableSorting: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <div className="h-5 w-full animate-pulse rounded bg-muted"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PortfolioTablePagination table={table} />
    </div>
  );
}

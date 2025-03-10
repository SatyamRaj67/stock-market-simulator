"use client";

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
import {
  Transaction,
  TransactionsResponse,
  TransactionType,
} from "@/lib/types";
import PortfolioTablePagination from "./portfolioTable/portfolioTablePagination";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

interface PortfolioTransactionsProps {
  userId?: string;
}

const columnHelper = createColumnHelper<Transaction>();

export default function PortfolioTransactions({
  userId,
}: PortfolioTransactionsProps) {
  const { data: session } = useSession();
  const effectiveUserId = userId || session?.user?.id;

  const [sorting, setSorting] = useState<SortingState>([
    { id: "timestamp", desc: true },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Use a stable fetch function that doesn't depend on state
  const fetchTransactions = async ({
    pageIndex,
    pageSize,
  }: {
    pageIndex: number;
    pageSize: number;
  }): Promise<TransactionsResponse> => {
    if (!effectiveUserId)
      return {
        transactions: [],
        total: 0,
        page: 0,
        limit: pageSize,
        totalPages: 0,
      };

    const res = await fetch(
      `/api/transactions?page=${pageIndex}&limit=${pageSize}`,
    );
    if (!res.ok) {
      throw new Error("Failed to fetch transactions");
    }
    return res.json();
  };

  // Update your useQuery hook to use the correct type
  const { data, isLoading, error } = useQuery<TransactionsResponse, Error>({
    queryKey: [
      "transactions",
      effectiveUserId,
      pagination.pageIndex,
      pagination.pageSize,
    ],
    queryFn: () => fetchTransactions(pagination),
    staleTime: 15000,
    enabled: !!effectiveUserId,
    placeholderData: (previousData) => previousData,
  });

  const transactions = data?.transactions || [];
  const totalPages = data?.totalPages || 0;
  const totalItems = data?.total || 0;

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
            row.original.type === TransactionType.BUY
              ? "text-green-600"
              : "text-red-600"
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
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      pagination,
    },
    enableSorting: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full">
      {isLoading && transactions.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">
          Error loading transactions: {(error as Error).message}
        </div>
      ) : (
        <>
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
                  // Show loading skeleton while fetching
                  Array.from({ length: pagination.pageSize }).map((_, i) => (
                    <TableRow key={`loading-${i}`}>
                      {Array.from({ length: table.getAllColumns().length }).map(
                        (_, j) => (
                          <TableCell key={`loading-cell-${j}`}>
                            <div className="h-5 w-full animate-pulse rounded-md bg-muted"></div>
                          </TableCell>
                        ),
                      )}
                    </TableRow>
                  ))
                ) : transactions.length > 0 ? (
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
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {transactions.length > 0 && (
            <PortfolioTablePagination
              table={table}
              totalItems={totalItems} // Pass the total count
            />
          )}
        </>
      )}
    </div>
  );
}

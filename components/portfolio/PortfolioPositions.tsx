"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTrading } from "@/lib/hooks/useTrading";

import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Position, Stock } from "@prisma/client";
import TradeDialog from "./portfolioPositions/TradeDialog"; // Uncomment this import

type PositionWithStock = Position & { stock: Stock };

// Helper for creating columns
const columnHelper = createColumnHelper<PositionWithStock>();

export default function PositionsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedPosition, setSelectedPosition] =
    useState<PositionWithStock | null>(null);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false); // Uncomment this
  const { buyStock, sellStock } = useTrading();

  // Fetch positions with better frequency
  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio-positions"],
    queryFn: async () => {
      const res = await fetch("/api/portfolio", {
        headers: { 'Cache-Control': 'no-cache, no-store' }
      });
      if (!res.ok) throw new Error("Failed to fetch portfolio data");
      const data = await res.json();
      return data.portfolio?.positions || [];
    },
    refetchInterval: 3000, // More frequent updates
    staleTime: 0,          // Always fetch fresh data
  });

  const positions = data || [];

  const columns = [
    // Your existing columns code...
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <Button
              size="sm"
              variant="outline"
              className="mr-2"
              onClick={() => openTradeDialog("buy", row.original)}
            >
              Buy
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openTradeDialog("sell", row.original)}
            >
              Sell
            </Button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: positions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const openTradeDialog = (
    type: "buy" | "sell",
    position: PositionWithStock,
  ) => {
    setSelectedPosition(position);
    setTradeType(type);
    setIsTradeDialogOpen(true); // This opens the dialog
  };

  // This function receives the quantity from the TradeDialog
  const handleTrade = async (quantity: number) => {
    if (!selectedPosition) return;

    try {
      if (tradeType === "buy") {
        await buyStock(selectedPosition.stockId, quantity);
      } else {
        await sellStock(selectedPosition.stockId, quantity);
      }
      setIsTradeDialogOpen(false);
    } catch (error) {
      console.error("Trade failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">Loading positions...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 py-6">
        Error loading positions: {(error as Error).message}
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">No positions yet</h3>
        <p className="text-muted-foreground mt-2">
          Start trading to build your portfolio
        </p>
        <Button className="mt-4" asChild>
          <a href="/market">Go to Market</a>
        </Button>
      </div>
    );
  }

  return (
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
                      : header.column.columnDef.header instanceof Function
                      ? header.column.columnDef.header(header.getContext()) // Use getContext() instead
                      : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.cell instanceof Function
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.column.columnDef.cell}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add the TradeDialog component here */}
      {selectedPosition && (
        <TradeDialog
          isOpen={isTradeDialogOpen}
          onClose={() => setIsTradeDialogOpen(false)}
          onTrade={handleTrade}
          stock={selectedPosition.stock}
          tradeType={tradeType}
          maxQuantity={
            tradeType === "sell" ? selectedPosition.quantity : undefined
          }
        />
      )}
    </>
  );
}

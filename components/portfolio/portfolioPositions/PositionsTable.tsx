"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { Position, Stock } from "@prisma/client";
import { useTrading } from "@/lib/hooks/useTrading";
import TradeDialog from "./TradeDialog";

type PositionWithStock = Position & { stock: Stock };

// Helper for creating columns
const columnHelper = createColumnHelper<PositionWithStock>();

export default function PositionsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedPosition, setSelectedPosition] = useState<PositionWithStock | null>(null);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false);
  
  const { buyStock, sellStock } = useTrading();


  // Fetch positions data with TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolio-positions'],
    queryFn: async () => {
      const res = await fetch('/api/portfolio');
      if (!res.ok) throw new Error('Failed to fetch portfolio data');
      const data = await res.json();
      return data.portfolio?.positions || [];
    },
    refetchInterval: 10000, // 10 seconds instead of 30
    staleTime: 5000,    // Consider data stale after 5 seconds
  });

  const positions = data || [];
  
  const columns = [
    columnHelper.accessor('stock.name', {
      header: 'Stock',
      cell: info => <div className="font-medium">{info.getValue()}</div>
    }),
    columnHelper.accessor('stock.symbol', {
      header: 'Symbol',
    }),
    columnHelper.accessor('quantity', {
      header: ({ column }) => (
        <div className="text-right flex justify-end">
          <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: info => <div className="text-right">{info.getValue()}</div>
    }),
    columnHelper.accessor('averageBuyPrice', {
      header: () => <div className="text-right">Avg. Price</div>,
      cell: info => <div className="text-right">${parseFloat(info.getValue().toString()).toFixed(2)}</div>
    }),
    columnHelper.accessor('stock.currentPrice', {
      header: () => <div className="text-right">Current Price</div>,
      cell: info => <div className="text-right">${parseFloat(info.getValue().toString()).toFixed(2)}</div>
    }),
    columnHelper.accessor('currentValue', {
      header: ({ column }) => (
        <div className="text-right flex justify-end">
          <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Current Value
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: info => <div className="text-right">${parseFloat(info.getValue().toString()).toFixed(2)}</div>,
      sortingFn: 'basic'
    }),
    columnHelper.display({
      id: 'profitLoss',
      header: () => <div className="text-right">Profit/Loss</div>,
      cell: ({ row }) => {
        const position = row.original;
        const profitLossPercent = 
          ((parseFloat(position.stock.currentPrice.toString()) - 
            parseFloat(position.averageBuyPrice.toString())) / 
            parseFloat(position.averageBuyPrice.toString())) * 100;
        const isProfitable = profitLossPercent > 0;
        
        return (
          <div className={`text-right ${isProfitable ? "text-green-600" : "text-red-600"}`}>
            {isProfitable ? "+" : ""}
            {parseFloat(position.profitLoss.toString()).toFixed(2)} ({profitLossPercent.toFixed(2)}%)
          </div>
        );
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <Button 
              size="sm" 
              variant="outline" 
              className="mr-2"
              onClick={() => openTradeDialog('buy', row.original)}
            >
              Buy
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => openTradeDialog('sell', row.original)}
            >
              Sell
            </Button>
          </div>
        );
      }
    })
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

  const openTradeDialog = (type: 'buy' | 'sell', position: PositionWithStock) => {
    setSelectedPosition(position);
    setTradeType(type);
    setIsTradeDialogOpen(true);
  };

  const handleTrade = async (quantity: number) => {
    if (!selectedPosition) return;
    
    try {
      const result = tradeType === "buy" 
        ? await buyStock(selectedPosition.stockId, quantity)
        : await sellStock(selectedPosition.stockId, quantity);
        
      if (result.success) {
        setIsTradeDialogOpen(false);
      }
    } catch (error) {
      console.error("Trade failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading positions...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-6">Error loading positions: {(error as Error).message}</div>;
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
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No positions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {selectedPosition && (
        <TradeDialog
          isOpen={isTradeDialogOpen}
          onClose={() => setIsTradeDialogOpen(false)}
          onTrade={handleTrade}
          stock={selectedPosition.stock}
          tradeType={tradeType}
          maxQuantity={tradeType === 'sell' ? selectedPosition.quantity : undefined}
        />
      )}
    </>
  );
}
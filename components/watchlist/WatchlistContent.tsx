"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { StockSearch } from "./stock-search";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  EyeOffIcon,
  RefreshCwIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { StockSearch } from "../stock/StockSearch";

// Function to remove a stock from watchlist
async function removeFromWatchlist(watchlistItemId: string) {
  const response = await fetch(`/api/watchlist/items/${watchlistItemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove stock from watchlist");
  }

  return response.json();
}

interface WatchlistItem {
  id: string;
  addedAt: string;
  stock: {
    symbol: string;
    name: string;
    currentPrice: string;
    previousClose?: string;
  };
}

interface Watchlist {
  id: string;
  items: WatchlistItem[];
}

export function WatchlistContent({
  initialWatchlist,
  userId,
}: {
  initialWatchlist: Watchlist;
  userId: string;
}) {
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState("symbol");
  const [sortDirection, setSortDirection] = useState("asc");

  // Fetch watchlist data with TanStack Query
  const {
    data: watchlist,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["watchlist", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/watchlist`);
      if (!response.ok) {
        throw new Error("Failed to fetch watchlist");
      }
      return response.json();
    },
    initialData: initialWatchlist,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Mutation for removing a stock from watchlist
  const removeStockMutation = useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
    },
  });

  // Sort watchlist items
  const sortedItems = [...watchlist.items].sort((a, b) => {
    let compareResult = 0;

    if (sortBy === "symbol") {
      compareResult = a.stock.symbol.localeCompare(b.stock.symbol);
    } else if (sortBy === "name") {
      compareResult = a.stock.name.localeCompare(b.stock.name);
    } else if (sortBy === "price") {
      compareResult =
        parseFloat(a.stock.currentPrice) - parseFloat(b.stock.currentPrice);
    } else if (sortBy === "change") {
      const changeA = a.stock.previousClose
        ? parseFloat(a.stock.currentPrice) - parseFloat(a.stock.previousClose)
        : 0;
      const changeB = b.stock.previousClose
        ? parseFloat(b.stock.currentPrice) - parseFloat(b.stock.previousClose)
        : 0;
      compareResult = changeA - changeB;
    }

    return sortDirection === "asc" ? compareResult : -compareResult;
  });

  const handleSort = (column: "symbol" | "name" | "price" | "change") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-6">
      <StockSearch watchlistId={watchlist.id} onAddStock={() => refetch()} />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Watched Stocks</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <CardDescription>
            Track prices of your favorite stocks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("symbol")}
                >
                  Symbol{" "}
                  {sortBy === "symbol" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name{" "}
                  {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right"
                  onClick={() => handleSort("price")}
                >
                  Price{" "}
                  {sortBy === "price" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right"
                  onClick={() => handleSort("change")}
                >
                  Change{" "}
                  {sortBy === "change" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="text-right">Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => {
                const priceChange = item.stock.previousClose
                  ? parseFloat(item.stock.currentPrice) -
                    parseFloat(item.stock.previousClose)
                  : 0;
                const percentChange = item.stock.previousClose
                  ? (priceChange / parseFloat(item.stock.previousClose)) * 100
                  : 0;
                const isPositive = priceChange >= 0;

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.stock.symbol}
                    </TableCell>
                    <TableCell>{item.stock.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      ${parseFloat(item.stock.currentPrice).toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <div className="flex items-center justify-end">
                        {isPositive ? (
                          <ArrowUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 mr-1" />
                        )}
                        {priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(item.addedAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStockMutation.mutate(item.id)}
                        disabled={removeStockMutation.isPending}
                      >
                        <EyeOffIcon className="h-4 w-4" />
                        <span className="sr-only">Remove from watchlist</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

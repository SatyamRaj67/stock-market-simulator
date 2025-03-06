"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { StockSearch } from "../stock/StockSearch";
import { Watchlist } from "@/lib/types";
import { WatchlistHeader } from "./WatchlistHeader";
import { WatchlistTable } from "./WatchlistTable";
import { useSortable } from "@/lib/hooks/useSortable";
import { toast } from "sonner"; // Add toast for user feedback

// Function to remove a stock from watchlist
async function removeFromWatchlist(watchlistItemId: string) {
  const response = await fetch(`/api/watchlist/items/${watchlistItemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    // Try to parse error as JSON, but handle non-JSON responses
    try {
      const error = await response.json();
      throw new Error(error.message || "Failed to remove stock from watchlist");
    } catch (error) {
      throw new Error(
        `Failed to remove stock from watchlist: ${(error as Error).message}`,
      );
    }
  }

  // Check if response has content before trying to parse as JSON
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  // Return a default success object for empty responses
  return { success: true };
}

export function WatchlistContent({
  initialWatchlist,
  userId,
}: {
  initialWatchlist: Watchlist;
  userId: string;
}) {
  const queryClient = useQueryClient();

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
      // Immediately invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
      toast.success("Stock removed from watchlist");
    },
    onError: (error) => {
      console.error("Failed to remove stock:", error);
      toast.error("Failed to remove stock from watchlist");
    },
  });

  // Handle removing stock with optimistic updates
  const handleRemoveStock = (id: string) => {
    // Store current watchlist for rollback
    const previousWatchlist = queryClient.getQueryData(["watchlist", userId]);

    // Optimistically update UI
    queryClient.setQueryData(
      ["watchlist", userId],
      (old: Watchlist | undefined) => ({
        ...old!,
        items: old?.items.filter((item) => item.id !== id) ?? [],
      }),
    );

    // Execute actual removal
    removeStockMutation.mutate(id, {
      onError: () => {
        // Rollback on failure
        queryClient.setQueryData(["watchlist", userId], previousWatchlist);
      },
    });
  };

  // Sort watchlist items using the custom hook
  const { sortedItems, sortBy, sortDirection, handleSort } = useSortable<{
    id: string;
    stock: {
      symbol: string;
      name: string;
      currentPrice: string;
      previousClose?: string;
    };
    addedAt: string;
  }>(watchlist.items || [], {
    defaultSortField: "symbol",
    sortFunctions: {
      symbol: (a, b) => a.stock.symbol.localeCompare(b.stock.symbol),
      name: (a, b) => a.stock.name.localeCompare(b.stock.name),
      price: (a, b) =>
        parseFloat(a.stock.currentPrice) - parseFloat(b.stock.currentPrice),
      change: (a, b) => {
        const changeA = a.stock.previousClose
          ? parseFloat(a.stock.currentPrice) - parseFloat(a.stock.previousClose)
          : 0;
        const changeB = b.stock.previousClose
          ? parseFloat(b.stock.currentPrice) - parseFloat(b.stock.previousClose)
          : 0;
        return changeA - changeB;
      },
    },
  });

  return (
    <div className="space-y-6">
      <StockSearch watchlistId={watchlist.id} onAddStock={() => refetch()} />

      <Card>
        <WatchlistHeader onRefresh={refetch} isLoading={isLoading} />
        <CardContent>
          <WatchlistTable
            items={sortedItems}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
            onRemoveItem={handleRemoveStock}
            isRemoving={removeStockMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

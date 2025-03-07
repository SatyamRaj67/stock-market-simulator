"use client";

import { useStockManagement } from "./useStockManagement";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useTrading() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { stocks } = useStockManagement();

  // Fetch portfolio and balance from API with better caching strategy
  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-portfolio", userId],
    queryFn: async () => {
      if (!userId) return { portfolio: {}, balance: 10000 };

      const response = await fetch(`/api/portfolio`, {
        // Add cache busting parameter to prevent browser caching
        headers: { "Cache-Control": "no-cache, no-store" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio");
      }
      return response.json();
    },
    enabled: !!userId,
    initialData: { portfolio: {}, balance: 10000 },
    staleTime: 0, // Consider all data stale immediately for real-time use
    //  cacheTime: 30000,
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  const portfolio = userData?.portfolio || {};
  const balance = userData?.balance || 10000;

  // Improved stock fetch with better error handling
  const fetchStock = async (stockId: string) => {
    try {
      // First try to find in local state (fast path)
      const localStock = stocks?.find((s) => s.id === stockId);
      if (localStock) return localStock;

      // If not found locally, fetch from API (slow path)
      const response = await fetch(`/api/stocks/${stockId}`);
      if (!response.ok) {
        throw new Error(`Stock not found: ${stockId}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching stock:", error);
      throw error; // Re-throw to properly handle in calling code
    }
  };

  // Use optimistic updates for transactions
  const buyMutation = useMutation({
    mutationFn: async ({
      stockId,
      quantity,
    }: {
      stockId: string;
      quantity: number;
    }) => {
      const stock = await getStockById(stockId);
      if (!stock) throw new Error("Stock not found");

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockId,
          quantity,
          type: "BUY",
          price: stock.currentPrice,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to buy stock");
      }

      return { data, stock };
    },
    // Use optimistic updates to make the UI feel faster
    onMutate: async ({ stockId, quantity }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["user-portfolio", userId] });

      // Get current data
      const previousData = queryClient.getQueryData(["user-portfolio", userId]);
      const stock = await getStockById(stockId);

      if (stock) {
        // Calculate new balance and portfolio
        const cost = quantity * parseFloat(stock.currentPrice);
        const newBalance = balance - cost;

        // Update portfolio optimistically
        const currentQuantity = portfolio[stockId]?.quantity || 0;
        const currentAvgPrice =
          portfolio[stockId]?.averageBuyPrice || stock.currentPrice;

        const newPortfolio = {
          ...portfolio,
          [stockId]: {
            quantity: currentQuantity + quantity,
            averageBuyPrice:
              (currentQuantity * currentAvgPrice +
                quantity * stock.currentPrice) /
              (currentQuantity + quantity),
          },
        };

        // Update the cache optimistically
        queryClient.setQueryData(["user-portfolio", userId], {
          portfolio: newPortfolio,
          balance: newBalance,
        });
      }

      // Return previous data for rollback
      return { previousData };
    },
    onSuccess: () => {
      invalidateQueries();
      toast.success("Successfully purchased stock");
    },
    onError: (error, __, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ["user-portfolio", userId],
          context.previousData,
        );
      }
      toast.error(
        error instanceof Error ? error.message : "Transaction failed",
      );
    },
  });

  // Updated sell mutation with similar optimistic updates
  const sellMutation = useMutation({
    mutationFn: async ({
      stockId,
      quantity,
    }: {
      stockId: string;
      quantity: number;
    }) => {
      // Always get the latest portfolio data first
      await refetch();

      const stock = await getStockById(stockId);
      if (!stock) throw new Error("Stock not found");

      // Use the freshest portfolio data
      const freshPortfolio =
        (
          queryClient.getQueryData(["user-portfolio", userId]) as {
            portfolio: Record<
              string,
              { quantity: number; averageBuyPrice: number }
            >;
          }
        )?.portfolio || {};
      const sharesOwned = freshPortfolio[stockId]?.quantity || 0;

      if (sharesOwned < quantity) {
        throw new Error(`You only own ${sharesOwned} shares of this stock`);
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockId,
          quantity,
          type: "SELL",
          price: stock.currentPrice,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to sell stock");
      }

      return { data, stock };
    },
    onMutate: async ({ stockId, quantity }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user-portfolio", userId] });

      // Get current data
      const previousData = queryClient.getQueryData(["user-portfolio", userId]);
      const stock = await getStockById(stockId);

      if (stock) {
        // Calculate new balance and portfolio
        const revenue = quantity * parseFloat(stock.currentPrice);
        const newBalance = balance + revenue;

        const currentQuantity = portfolio[stockId]?.quantity || 0;
        const newQuantity = currentQuantity - quantity;

        const newPortfolio = { ...portfolio };

        if (newQuantity <= 0) {
          // Remove stock if no shares left
          delete newPortfolio[stockId];
        } else {
          // Update quantity
          newPortfolio[stockId] = {
            ...newPortfolio[stockId],
            quantity: newQuantity,
          };
        }

        // Update the cache optimistically
        queryClient.setQueryData(["user-portfolio", userId], {
          portfolio: newPortfolio,
          balance: newBalance,
        });
      }

      // Return previous data for rollback
      return { previousData };
    },
    onSuccess: () => {
      invalidateQueries();
      toast.success("Successfully sold stock");
    },
    onError: (error, __, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ["user-portfolio", userId],
          context.previousData,
        );
      }
      toast.error(
        error instanceof Error ? error.message : "Transaction failed",
      );
    },
  });

  // Improved stock fetching
  const getStockById = async (stockId: string) => {
    try {
      return await queryClient.fetchQuery({
        queryKey: ["stock", stockId],
        queryFn: () => fetchStock(stockId),
        staleTime: 5000, // Consider stock data stale after 5 seconds
      });
    } catch (error) {
      console.error("Error fetching stock:", error);
      return null;
    }
  };

  // Improved query invalidation strategy
  const invalidateQueries = async () => {
    // Immediately update UI with invalidations
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["user-portfolio", userId] }),
      queryClient.invalidateQueries({ queryKey: ["portfolio-positions"] }),
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
    ]);

    // Only refetch stock data if needed (less frequently)
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    }, 1000);
  };

  return {
    buyStock: async (stockId: string, quantity: number) => {
      try {
        await buyMutation.mutateAsync({ stockId, quantity });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        };
      }
    },
    sellStock: async (stockId: string, quantity: number) => {
      try {
        await sellMutation.mutateAsync({ stockId, quantity });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        };
      }
    },
    balance,
    portfolio,
    isLoading,
    refreshPortfolio: invalidateQueries,
    isTransacting: buyMutation.isPending || sellMutation.isPending,
  };
}

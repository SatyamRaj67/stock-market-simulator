"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Stock } from "@/lib/types";
import StockTableContent from "./StockTable/StockTableContent";

interface StocksDataProviderProps {
  initialStocks: Stock[];
  onEdit?: (stock: Stock) => void;
  onDelete?: (stockId: string) => void;
  showActions?: boolean;
}

export function StockTable({
  initialStocks,
  onEdit,
  onDelete,
  showActions,
}: StocksDataProviderProps) {
  const queryClient = useQueryClient();

  // Fetch stocks data with TanStack Query
  const { data: stocks, isLoading } = useQuery({
    queryKey: ["stocks"],
    queryFn: async () => {
      const response = await fetch(`/api/stocks`);
      if (!response.ok) {
        throw new Error("Failed to fetch stocks");
      }
      return response.json();
    },
    initialData: initialStocks,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Handle delete mutation with cache invalidation
  const deleteMutation = useMutation({
    mutationFn: async (stockId: string) => {
      const response = await fetch(`/api/stocks/${stockId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete stock");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
  });

  // Enhanced delete handler that uses the mutation
  const handleDelete = (stockId: string) => {
    deleteMutation.mutate(stockId);
    if (onDelete) onDelete(stockId);
  };

  return (
    <StockTableContent
      stocks={stocks}
      onEdit={onEdit}
      onDelete={handleDelete}
      showActions={showActions}
      isLoading={isLoading || deleteMutation.isPending}
    />
  );
}

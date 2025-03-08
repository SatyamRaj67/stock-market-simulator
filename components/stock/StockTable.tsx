"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Stock } from "@/lib/types";
import StockTableContent from "./StockTable/StockTableContent";
import { toast } from "sonner";

interface StocksDataProviderProps {
  initialStocks: Stock[];
  onEdit?: (stock: Stock) => void;
  onDelete?: (stockId: string) => void;
  showActions?: boolean;
  showTrading?: boolean;
}

// Optimized version with better performance
export function StockTable({
  initialStocks,
  onEdit,
  onDelete,
  showActions,
  showTrading,
}: StocksDataProviderProps) {
  const queryClient = useQueryClient();

  // Fetch stocks with optimized settings
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
    staleTime: 5000, 
    refetchOnMount: true, 
    refetchOnWindowFocus: false, 
  });

  // Handle delete mutation with cache invalidation
  // In your StockTable component, update the deleteMutation:
  const deleteMutation = useMutation({
    mutationFn: async (stockId: string) => {
      const response = await fetch(`/api/stocks/${stockId}`, {
        method: "DELETE",
      });

      // Handle the 400 status for constraint errors
      if (response.status === 400) {
        const data = await response.json();
        // If this is a foreign key constraint error (has transactions)
        if (data.hasRelatedTransactions) {
          throw new Error("Cannot delete stock with related transactions");
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete stock");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete stock",
      );
    },
  });
  // Enhanced delete handler that uses the mutation
  const handleDelete = async (stockId: string) => {
    try {
      // Just call onDelete directly - let the parent component handle it
      if (onDelete) {
        await onDelete(stockId);
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
      // Don't show error toast here - the parent component will handle it
    }
  };

  return (
    <StockTableContent
      stocks={stocks}
      onEdit={onEdit}
      onDelete={handleDelete}
      showActions={showActions}
      showTrading={showTrading}
      isLoading={isLoading || deleteMutation.isPending}
    />
  );
}

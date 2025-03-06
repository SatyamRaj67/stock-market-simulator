"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Stock } from "@/lib/types";
import { toast } from "sonner";

export function useStockManagement(initialData?: Stock[]) {
  const queryClient = useQueryClient();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);

  // Query for fetching stocks
  const { 
    data: stocks = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["stocks"],
    queryFn: async () => {
      const response = await fetch("/api/stocks");
      if (!response.ok) {
        throw new Error("Failed to fetch stocks");
      }
      return response.json();
    },
    initialData
  });

  // Mutation for adding/updating stocks
  const stockMutation = useMutation({
    mutationFn: async (stock: Partial<Stock>) => {
      const url = stock.id ? `/api/stocks/${stock.id}` : "/api/stocks";
      const method = stock.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stock),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${stock.id ? "update" : "create"} stock`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch stocks
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast.success(`Stock ${editingStock ? "updated" : "created"} successfully`);
      setEditingStock(null);
      setIsFormVisible(false);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  // Mutation for deleting stocks
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
    onMutate: async (stockId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["stocks"] });
      
      // Snapshot the previous value
      const previousStocks = queryClient.getQueryData(["stocks"]);
      
      // Optimistically update the UI
      queryClient.setQueryData(
        ["stocks"], 
        (old: Stock[] = []) => old.filter(stock => stock.id !== stockId)
      );
      
      return { previousStocks };
    },
    onSuccess: () => {
      toast.success("Stock deleted successfully");
    },
    onError: (error, _, context) => {
      // If the mutation fails, roll back to the previous value
      queryClient.setQueryData(["stocks"], context?.previousStocks);
      toast.error(`Error: ${error.message}`);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
  });

  // Form handling
  const handleAddStock = () => {
    setEditingStock(null);
    setIsFormVisible(true);
  };

  const handleEditStock = (stock: Stock) => {
    setEditingStock(stock);
    setIsFormVisible(true);
  };

  const handleDeleteStock = (stockId: string) => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      deleteMutation.mutate(stockId);
    }
  };

  const handleFormSubmit = (stockData: Partial<Stock>) => {
    // If editing, include the ID
    if (editingStock) {
      stockMutation.mutate({ ...stockData, id: editingStock.id });
    } else {
      stockMutation.mutate(stockData);
    }
  };

  return {
    stocks,
    isLoading: isLoading || stockMutation.isPending || deleteMutation.isPending,
    error,
    editingStock,
    isFormVisible,
    refetch,
    handleAddStock,
    handleEditStock,
    handleDeleteStock,
    handleFormSubmit,
    setIsFormVisible,
  };
}
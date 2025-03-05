import { useState, useEffect } from "react";
import { Stock, StockFormData } from "@/types";

export const useStockManagement = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Fetch all stocks
  const fetchStocks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stocks");
      if (!response.ok) throw new Error("Failed to fetch stocks");
      const data = await response.json();
      setStocks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleAddStock = () => {
    setEditingStock(null);
    setIsFormVisible(true);
  };

  const handleEditStock = (stock: Stock) => {
    setEditingStock(stock);
    setIsFormVisible(true);
  };

  const handleDeleteStock = async (stockId: string) => {
    if (confirm("Are you sure you want to delete this stock?")) {
      try {
        const response = await fetch(`/api/stocks/${stockId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete stock");

        fetchStocks();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }
  };

  const handleFormSubmit = async (stockData: StockFormData) => {
    try {
      if (editingStock) {
        // Update existing stock
        const response = await fetch(`/api/stocks/${editingStock.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stockData),
        });

        if (!response.ok) throw new Error("Failed to update stock");
      } else {
        // Create new stock
        const response = await fetch("/api/stocks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stockData),
        });

        if (!response.ok) throw new Error("Failed to create stock");
      }

      setIsFormVisible(false);
      fetchStocks(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return {
    stocks,
    isLoading,
    error,
    editingStock,
    isFormVisible,
    fetchStocks,
    handleAddStock,
    handleEditStock,
    handleDeleteStock,
    handleFormSubmit,
    setIsFormVisible,
  };
};

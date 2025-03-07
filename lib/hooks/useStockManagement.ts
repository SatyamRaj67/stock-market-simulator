import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Stock, StockFormData, User } from "../types";

type AffectedUser = {
  user: User;
  count: number;
};

type DeleteErrorResponse = {
  error: string;
  hasRelatedTransactions: boolean;
  transactionCount: number;
  affectedUsers: AffectedUser[];
};

export function useStockManagement() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({
    isOpen: false,
    stockId: "",
    stockName: "",
    transactionCount: 0,
    affectedUsers: [] as AffectedUser[],
  });

  // Fetch all stocks
  const fetchStocks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/stocks");

      if (!response.ok) {
        throw new Error("Failed to fetch stocks");
      }

      const data = await response.json();
      setStocks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast.error("Failed to load stocks");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize by fetching stocks
  useEffect(() => {
    fetchStocks();
  }, []);

  // Handle adding a new stock
  const handleAddStock = () => {
    setEditingStock(null);
    setIsFormVisible(true);
  };

  // Handle editing a stock
  const handleEditStock = (stock: Stock) => {
    setEditingStock(stock);
    setIsFormVisible(true);
  };

  // Handle form submission for creating or updating a stock
  const handleFormSubmit = async (formData: StockFormData) => {
    try {
      setError(null);

      if (editingStock) {
        // Update existing stock
        const response = await fetch(`/api/stocks/${editingStock.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to update stock");
        }

        toast.success("Stock updated successfully");
      } else {
        // Create new stock
        const response = await fetch("/api/stocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to create stock");
        }

        toast.success("Stock created successfully");
      }

      setIsFormVisible(false);
      fetchStocks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast.error(err instanceof Error ? err.message : "Operation failed");
    }
  };

  // Handle delete stock
  const handleDeleteStock = async (stockId: string) => {
    const stock = stocks.find((s) => s.id === stockId);
    try {
      setError(null);

      const response = await fetch(`/api/stocks/${stock?.id}`, {
        method: "DELETE",
      });

      // If there are related transactions, show the modal
      if (response.status === 400) {
        const data = (await response.json()) as DeleteErrorResponse;

        if (data.hasRelatedTransactions && stock) {
          setDeleteModalData({
            isOpen: true,
            stockId: stock.id,
            stockName: stock.name,
            transactionCount: data.transactionCount,
            affectedUsers: data.affectedUsers,
          });
          return;
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete stock");
      }

      toast.success("Stock deleted successfully");
      fetchStocks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast.error(
        err instanceof Error ? err.message : "Failed to delete stock",
      );
    }
  };

  // Handle force delete stock (deletes stock and all related transactions)
  const handleForceDelete = async () => {
    try {
      setError(null);

      const response = await fetch(`/api/stocks/${deleteModalData.stockId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceDelete: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete stock");
      }

      toast.success("Stock and related transactions deleted successfully");
      setDeleteModalData((prev) => ({ ...prev, isOpen: false }));
      fetchStocks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast.error(
        err instanceof Error ? err.message : "Failed to force delete stock",
      );
    }
  };

  return {
    stocks,
    isLoading,
    error,
    editingStock,
    isFormVisible,
    deleteModalData,
    fetchStocks,
    handleAddStock,
    handleEditStock,
    handleDeleteStock,
    handleForceDelete,
    handleFormSubmit,
    setIsFormVisible,
    setDeleteModalData,
  };
}

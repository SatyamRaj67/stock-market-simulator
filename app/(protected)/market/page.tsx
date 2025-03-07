"use client";

import { StockTable } from "@/components/stock/StockTable";
import { useStockManagement } from "@/lib/hooks/useStockManagement";
import { useTrading } from "@/lib/hooks/useTrading";
import { Toaster } from "sonner";

export default function Page() {
  const { stocks, isLoading: stocksLoading } = useStockManagement();
  const { balance, isLoading: portfolioLoading } = useTrading();
  const isLoading = stocksLoading || portfolioLoading;

  return (
    <div className="p-4 px-20">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <p className="text-5xl">Market Overview</p>
        <div className="text-xl font-semibold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-md border border-green-200 dark:border-green-800">
          Balance:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(balance)}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
          <span className="ml-3">Loading market data...</span>
        </div>
      ) : (
        <StockTable initialStocks={stocks} showTrading={true} />
      )}
    </div>
  );
}

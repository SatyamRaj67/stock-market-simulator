"use client";

import StockTable from "@/components/stock/StockTable";
import { useStockManagement } from "@/hooks/useStockManagement";

export default function Page() {
  const { stocks, isLoading } = useStockManagement();

  return (
    <div className="p-4 px-20">
      <p className="text-5xl">Market Overview</p>
      {isLoading ? <p>Loading stocks...</p> : <StockTable stocks={stocks} />}
    </div>
  );
}

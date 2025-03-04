"use client";

import StockTable from "@/components/stock/StockTable";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStocks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stocks");
      if (!response.ok) throw new Error("Failed to fetch stocks");
      const data = await response.json();
      setStocks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);
  return (
    <div className="p-4 px-20">
      {isLoading ? <p>Loading stocks...</p> : <StockTable stocks={stocks} />}
    </div>
  );
}

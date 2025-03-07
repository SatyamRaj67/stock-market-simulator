"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import PortfolioHeader from "./PortfolioHeader";

// Fetch portfolio data
const fetchPortfolioData = async () => {
  const response = await fetch("/api/portfolio");
  if (!response.ok) {
    throw new Error("Failed to fetch portfolio data");
  }
  return response.json();
};

export default function ClientPortfolioHeader() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolioData"],
    queryFn: fetchPortfolioData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return <div className="animate-pulse h-24 bg-slate-200 rounded-lg"></div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading portfolio data</div>;
  }

  return (
    <PortfolioHeader
      balance={data.balance}
      portfolioValue={data.portfolioValue}
      totalProfit={data.totalProfit}
    />
  );
}

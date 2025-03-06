import React from "react";
import { Stock } from "@/lib/types";
import { StockTable } from "../stock/StockTable";

type AdminListSectionProps = {
  isLoading: boolean;
  stocks: Stock[];
  onEdit: (stock: Stock) => void;
  onDelete: (stockId: string) => void;
};

export const AdminListSection: React.FC<AdminListSectionProps> = ({
  isLoading,
  stocks,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return <p>Loading stocks...</p>;
  }

  return <StockTable initialStocks={stocks} onEdit={onEdit} onDelete={onDelete} />;
};

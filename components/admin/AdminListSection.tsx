import React from "react";
import StockTable from "@/components/stock/StockTable";
import { Stock } from "@/types";

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

  return <StockTable stocks={stocks} onEdit={onEdit} onDelete={onDelete} />;
};

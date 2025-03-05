import React from "react";
import StockForm from "@/components/stock/StockForm";
import { Stock, StockFormData } from "@/types";

type AdminFormWrapperProps = {
  isVisible: boolean;
  editingStock: Stock |  null | undefined;
  onSubmit: (data: StockFormData) => Promise<void>;
  onCancel: () => void;
};

export const AdminFormWrapper: React.FC<AdminFormWrapperProps> = ({
  isVisible,
  editingStock,
  onSubmit,
  onCancel,
}) => {
  if (!isVisible) return null;

  return (
    <StockForm
      initialData={editingStock}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

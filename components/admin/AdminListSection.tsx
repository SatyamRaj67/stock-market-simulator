import React from "react";
import { Stock } from "@/lib/types";
import { StockTable } from "../stock/StockTable";
import { StockDeleteDialogue } from "../stock/StockDeleteDialogue";

type DeleteModalData = {
  isOpen: boolean;
  stockId: string;
  stockName: string;
  transactionCount: number;
  affectedUsers: Array<{
    user: { id: string; name: string | null; email: string | null };
    count: number;
  }>;
};

type AdminListSectionProps = {
  isLoading: boolean;
  stocks: Stock[];
  onEdit: (stock: Stock) => void;
  onDelete: (stockId: string) => Promise<void>;
  deleteModalData: DeleteModalData;
  setDeleteModalData: (
    data: DeleteModalData | ((prev: DeleteModalData) => DeleteModalData),
  ) => void;
  onForceDelete: () => void;
};

export const AdminListSection: React.FC<AdminListSectionProps> = ({
  isLoading,
  stocks,
  onEdit,
  onDelete,
  deleteModalData,
  setDeleteModalData,
  onForceDelete,
}) => {
  if (isLoading) {
    return <p>Loading stocks...</p>;
  }

  return (
    <>
      <StockDeleteDialogue
        isOpen={deleteModalData.isOpen}
        stockName={deleteModalData.stockName}
        transactionCount={deleteModalData.transactionCount}
        affectedUsers={deleteModalData.affectedUsers}
        onOpenChange={(open) =>
          setDeleteModalData((prev) => ({ ...prev, isOpen: open }))
        }
        onForceDelete={onForceDelete}
      />
      <StockTable initialStocks={stocks} onEdit={onEdit} onDelete={onDelete} />
    </>
  );
};

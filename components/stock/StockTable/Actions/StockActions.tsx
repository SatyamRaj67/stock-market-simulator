import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Stock } from "@/lib/types";

interface StockActionsProps {
  stock: Stock;
  onEdit?: (stock: Stock) => void;
  onDelete?: (stockId: string) => void;
}

export const StockActions: React.FC<StockActionsProps> = ({
  stock,
  onEdit,
  onDelete,
}) => (
  <div className="flex items-center justify-end gap-2">
    <Button 
      size="sm" 
      variant="outline" 
      onClick={() => onEdit && onEdit(stock)}
    >
      <Edit className="h-4 w-4 mr-1" />
      Edit
    </Button>
    <Button
      size="sm"
      variant="destructive"
      onClick={() => onDelete && onDelete(stock.id)}
    >
      <Trash2 className="h-4 w-4 mr-1" />
      Delete
    </Button>
  </div>
);
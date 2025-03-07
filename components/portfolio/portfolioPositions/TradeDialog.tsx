"use client";

import { useState } from "react";
import { Stock } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTrade: (quantity: number) => void;
  stock: Stock;
  tradeType: "buy" | "sell";
  maxQuantity?: number;
}

export default function TradeDialog({
  isOpen,
  onClose,
  onTrade,
  stock,
  tradeType,
  maxQuantity,
}: TradeDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value <= 0) {
      setQuantity(1);
      setError("Quantity must be a positive number");
      return;
    }

    if (tradeType === "sell" && maxQuantity && value > maxQuantity) {
      setQuantity(maxQuantity);
      setError(`You only have ${maxQuantity} shares to sell`);
      return;
    }

    setQuantity(value);
    setError(null);
  };

  const handleTrade = () => {
    if (quantity <= 0) {
      setError("Quantity must be a positive number");
      return;
    }

    if (tradeType === "sell" && maxQuantity && quantity > maxQuantity) {
      setError(`You only have ${maxQuantity} shares to sell`);
      return;
    }

    onTrade(quantity);
  };

  const totalValue = quantity * parseFloat(stock.currentPrice.toString());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {tradeType === "buy" ? "Buy" : "Sell"} {stock.name} ({stock.symbol})
          </DialogTitle>
          <DialogDescription>
            Current price: $
            {parseFloat(stock.currentPrice.toString()).toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={tradeType === "sell" ? maxQuantity : undefined}
              value={quantity}
              onChange={handleQuantityChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Total Value</Label>
            <div className="col-span-3 font-medium">
              ${totalValue.toFixed(2)}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleTrade}
            variant={tradeType === "buy" ? "default" : "destructive"}
          >
            {tradeType === "buy" ? "Buy" : "Sell"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

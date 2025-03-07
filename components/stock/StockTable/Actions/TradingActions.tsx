"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stock } from "@/lib/types";
import { TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import { useTrading } from "@/lib/hooks/useTrading";
import { toast } from "sonner"; // Assuming you're using sonner for toasts

interface TradingActionsProps {
  stock: Stock;
}

export const TradingActions: React.FC<TradingActionsProps> = ({ stock }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { buyStock, sellStock, portfolio, isTransacting } = useTrading();

  // Get current position details for this stock (if any)
  const position = portfolio[stock.id];
  const sharesOwned = position?.quantity || 0;

  const handleBuy = async () => {
    if (!stock?.id) {
      toast.error("Invalid stock selected");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Buying stock with ID:", stock.id, "Quantity:", quantity);
      const result = await buyStock(stock.id, quantity);

      if (result.success) {
        toast.success(
          `Successfully bought ${quantity} shares of ${stock.symbol}`,
        ); // Explicitly refresh portfolio after transaction
      } else {
        toast.error(result.error || "Failed to buy stock");
        console.error("Buy error:", result.error);
      }
    } catch (error) {
      console.error("Error buying stock:", error);
      toast.error("An unexpected error occurred while buying");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSell = async () => {
    if (!stock?.id) {
      toast.error("Invalid stock selected");
      return;
    }

    if (sharesOwned < quantity) {
      toast.error(`You only own ${sharesOwned} shares of this stock`);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Selling stock with ID:", stock.id, "Quantity:", quantity);
      const result = await sellStock(stock.id, quantity);

      if (result.success) {
        toast.success(
          `Successfully sold ${quantity} shares of ${stock.symbol}`,
        );
      } else {
        toast.error(result.error || "Failed to sell stock");
        console.error("Sell error:", result.error);
      }
    } catch (error) {
      console.error("Error selling stock:", error);
      toast.error("An unexpected error occurred while selling");
    } finally {
      setIsLoading(false);
    }
  };

  // Debug info - remove in production
  console.log("Stock in TradingActions:", stock);
  console.log("Portfolio position:", position);

  return (
    <div className="flex items-center justify-end gap-2">
      <Input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) =>
          setQuantity(Math.max(1, parseInt(e.target.value) || 1))
        }
        className="w-20"
        disabled={isLoading || isTransacting}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={handleBuy}
        disabled={isLoading || isTransacting || !stock?.id}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {isLoading || isTransacting ? (
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
        ) : (
          <TrendingUp className="mr-1 h-4 w-4" />
        )}
        Buy
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleSell}
        disabled={
          isLoading || isTransacting || sharesOwned < quantity || !stock?.id
        }
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        {isLoading || isTransacting ? (
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
        ) : (
          <TrendingDown className="mr-1 h-4 w-4" />
        )}
        Sell
      </Button>
      {sharesOwned > 0 && (
        <span className="text-sm ml-2">Owned: {sharesOwned}</span>
      )}
    </div>
  );
};

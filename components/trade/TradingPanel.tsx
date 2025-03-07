"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TradingPanelProps {
  stockId: string;
  stockSymbol: string;
  currentPrice: number;
}

export function TradingPanel({
  // stockId,
  stockSymbol,
  currentPrice,
}: TradingPanelProps) {
  const [quantity, setQuantity] = useState(1);

  const handleBuy = () => {
    console.log(`Buy ${quantity} shares of ${stockSymbol} at $${currentPrice}`);
    // Trading logic will be implemented later
  };

  const handleSell = () => {
    console.log(`Sell ${quantity} shares of ${stockSymbol} at $${currentPrice}`);
    // Trading logic will be implemented later
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-20"
      />
      <Button onClick={handleBuy} variant="outline" className="bg-green-600 hover:bg-green-700 text-white">
        Buy
      </Button>
      <Button onClick={handleSell} variant="outline" className="bg-red-600 hover:bg-red-700 text-white">
        Sell
      </Button>
    </div>
  );
}
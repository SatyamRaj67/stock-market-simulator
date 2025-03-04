import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Position, Stock } from "@prisma/client";

type PositionWithStock = Position & { stock: Stock };

interface PortfolioPositionsProps {
  positions: PositionWithStock[];
}

export default function PortfolioPositions({
  positions,
}: PortfolioPositionsProps) {
  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">No positions yet</h3>
        <p className="text-muted-foreground mt-2">
          Start trading to build your portfolio
        </p>
        <Button className="mt-4" asChild>
          <a href="/market">Go to Market</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stock</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Avg. Price</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Current Value</TableHead>
            <TableHead className="text-right">Profit/Loss</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((position) => {
            const profitLossPercent =
              ((parseFloat(position.stock.currentPrice.toString()) -
                parseFloat(position.averageBuyPrice.toString())) /
                parseFloat(position.averageBuyPrice.toString())) *
              100;

            const isProfitable = profitLossPercent > 0;

            return (
              <TableRow key={position.id}>
                <TableCell className="font-medium">
                  {position.stock.name}
                </TableCell>
                <TableCell>{position.stock.symbol}</TableCell>
                <TableCell className="text-right">
                  {position.quantity}
                </TableCell>
                <TableCell className="text-right">
                  ${parseFloat(position.averageBuyPrice.toString()).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  $
                  {parseFloat(position.stock.currentPrice.toString()).toFixed(
                    2,
                  )}
                </TableCell>
                <TableCell className="text-right">
                  ${parseFloat(position.currentValue.toString()).toFixed(2)}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    isProfitable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isProfitable ? "+" : ""}
                  {parseFloat(position.profitLoss.toString()).toFixed(2)} (
                  {profitLossPercent.toFixed(2)}%)
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" className="mr-2">
                    Buy
                  </Button>
                  <Button size="sm" variant="outline">
                    Sell
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

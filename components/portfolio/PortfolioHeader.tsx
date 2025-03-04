import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { Decimal } from "@prisma/client/runtime/library";

interface PortfolioHeaderProps {
  balance: Decimal;
  portfolioValue: Decimal;
  totalProfit: Decimal;
}

export default function PortfolioHeader({
  balance,
  portfolioValue,
  totalProfit,
}: PortfolioHeaderProps) {
  const totalValue =
    parseFloat(balance.toString()) + parseFloat(portfolioValue.toString());
  const isProfitable = parseFloat(totalProfit.toString()) > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6 flex flex-row justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Available Balance
            </p>
            <h2 className="text-3xl font-bold">
              ${parseFloat(balance.toString()).toFixed(2)}
            </h2>
          </div>
          <Wallet className="h-8 w-8 text-muted-foreground" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-row justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Portfolio Value
            </p>
            <h2 className="text-3xl font-bold">
              ${parseFloat(portfolioValue.toString()).toFixed(2)}
            </h2>
          </div>
          <div className="h-8 w-8 text-muted-foreground flex items-center justify-center">
            ${totalValue.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-row justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Profit/Loss
            </p>
            <h2
              className={`text-3xl font-bold ${
                isProfitable ? "text-green-600" : "text-red-600"
              }`}
            >
              {isProfitable ? "+" : ""}
              {parseFloat(totalProfit.toString()).toFixed(2)}
            </h2>
          </div>
          {isProfitable ? (
            <ArrowUpRight className="h-8 w-8 text-green-600" />
          ) : (
            <ArrowDownRight className="h-8 w-8 text-red-600" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

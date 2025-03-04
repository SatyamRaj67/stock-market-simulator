import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function WelcomeSection() {
  return (
    <div className="text-center max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Welcome to StockSim
      </h1>

      <p className="text-xl text-muted-foreground mb-8">
        Experience the thrill of stock trading without the financial risk.
        Perfect for beginners and experienced traders alike.
      </p>

      <Card className="bg-blue-600 border-blue-800">
        <CardContent className="p-6">
          <p className="text-white">
            Trade virtual stocks with real-time market data. Learn, practice,
            and refine your investment strategies in a risk-free environment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

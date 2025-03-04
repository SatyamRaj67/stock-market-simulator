import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function FeatureHighlight() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">Real-Time Data</h3>
          <p className="text-muted-foreground">
            Practice with actual market conditions using live stock data.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">Portfolio Tracking</h3>
          <p className="text-muted-foreground">
            Monitor your performance and track your virtual investments.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">Risk-Free Learning</h3>
          <p className="text-muted-foreground">
            Master investment strategies without risking real money.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { StockSearch } from "@/components/stock/StockSearch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeIcon } from "lucide-react";

export function EmptyWatchlist({ watchlistId }: { watchlistId: string }) {
  return (
    <div className="space-y-6">
      <StockSearch
        watchlistId={watchlistId}
        onAddStock={() => window.location.reload()}
      />

      <Card>
        <CardHeader>
          <CardTitle>Your watchlist is empty</CardTitle>
          <CardDescription>
            Start tracking stocks you&apos;re interested in by adding them to
            your watchlist
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <EyeIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            No stocks in your watchlist
          </h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Use the search box above to find stocks and add them to your
            watchlist. This will help you keep track of stocks you&apos;re
            interested in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

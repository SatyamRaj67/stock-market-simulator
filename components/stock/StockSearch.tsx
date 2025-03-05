"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon, Loader2 } from "lucide-react";
import { Stock } from "@/lib/types";

export function StockSearch({
  watchlistId,
  onAddStock,
}: {
  watchlistId: string;
  onAddStock?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Simple fetch function that doesn't rely on TanStack Query
  const handleSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/stocks/search?q=${encodeURIComponent(query)}`,
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();

      // Defensive check to ensure we always have an array
      if (Array.isArray(data)) {
        setSearchResults(data);
      } else {
        console.warn("API returned non-array data:", data);
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search stocks. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add stock to watchlist
  const addToWatchlist = async (stockId: string) => {
    try {
      const response = await fetch("/api/watchlist/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watchlistId, stockId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to watchlist");
      }

      // Success - clear search and notify parent
      setSearchQuery("");
      setSearchResults([]);
      if (onAddStock) onAddStock();
    } catch (err) {
      console.error("Error adding to watchlist:", err);
      setError("Failed to add stock to watchlist");
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search stocks by symbol or name..."
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              handleSearch(value);
            }}
            className="pl-10"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-2 text-sm text-white bg-red-500 rounded">
            {error}
          </div>
        )}

        {/* Results */}
        {searchQuery.length >= 2 && !isLoading && searchResults.length > 0 && (
          <div className="border rounded-md max-h-60 overflow-y-auto">
            {searchResults.map((stock) => (
              <div
                key={stock.id}
                className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer border-b last:border-0"
                onClick={() => addToWatchlist(stock.id)}
              >
                <div>
                  <span className="font-medium">{stock.symbol}</span>
                  <span className="ml-2 text-muted-foreground">
                    {stock.name}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWatchlist(stock.id);
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {searchQuery.length >= 2 &&
          !isLoading &&
          searchResults.length === 0 && (
            <div className="p-3 text-center text-sm text-muted-foreground border rounded-md">
              No stocks found
            </div>
          )}
      </div>
    </Card>
  );
}

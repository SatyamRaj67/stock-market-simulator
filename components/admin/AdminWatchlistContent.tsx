"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Watchlist type with full serialized data
type WatchlistItem = {
  id: string;
  addedAt: string;
  stock: {
    id: string;
    symbol: string;
    name: string;
    currentPrice: string;
  }
}

type Watchlist = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    avatarUrl: string | null;
  };
  items: WatchlistItem[];
}

export function AdminWatchlistContent() {
  const queryClient = useQueryClient();
  
  // Fetch watchlists
  const { 
    data: watchlists = [], 
    isLoading, 
    error 
  } = useQuery<Watchlist[]>({
    queryKey: ['adminWatchlists'],
    queryFn: async () => {
      const response = await fetch('/api/admin/watchlists');
      if (!response.ok) throw new Error('Failed to fetch watchlists');
      return response.json();
    }
  });

  // Count users without watchlists
  const { 
    data: missingWatchlistsData,
    // isLoading: isMissingCountLoading
  } = useQuery({
    queryKey: ['adminMissingWatchlists'],
    queryFn: async () => {
      const response = await fetch('/api/admin/watchlists/missing-count');
      if (!response.ok) throw new Error('Failed to fetch missing count');
      return response.json();
    }
  });

  // Mutation to create missing watchlists
  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/watchlists', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to create watchlists');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['adminWatchlists'] });
      queryClient.invalidateQueries({ queryKey: ['adminMissingWatchlists'] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading watchlists</p>
        <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  const missingCount = missingWatchlistsData?.count || 0;

  return (
    <div>
      {/* Debug info and action button */}
      {missingCount > 0 && (
        <div className="mb-6 p-4 bg-background border border-red-500 rounded-md">
          <p className="mb-2">
            Found {missingCount} users without watchlists.
          </p>
          <Button 
            onClick={() => mutate()} 
            disabled={isCreating}
            variant="outline"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Missing Watchlists'
            )}
          </Button>
        </div>
      )}

      {watchlists.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No watchlists found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {watchlists.map((watchlist) => (
            <Card key={watchlist.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={watchlist.user.avatarUrl || ""} />
                      <AvatarFallback>
                        {watchlist.user.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{watchlist.user.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {watchlist.user.email}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={watchlist.items.length > 0 ? "default" : "outline"}
                  >
                    {watchlist.items.length} stocks
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {watchlist.items.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Current Price</TableHead>
                        <TableHead>Added On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {watchlist.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.stock.symbol}
                          </TableCell>
                          <TableCell>{item.stock.name}</TableCell>
                          <TableCell>
                            ${Number(item.stock.currentPrice).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {new Date(item.addedAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No stocks in this watchlist
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
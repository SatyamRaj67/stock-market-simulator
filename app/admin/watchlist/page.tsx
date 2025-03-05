import { prisma } from "@/lib/prisma";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export default async function WatchlistPage() {
  // Debug info - count users without watchlists
  const usersWithoutWatchlists = await prisma.user.count({
    where: {
      watchlist: null,
    },
  });

  // Fetch all watchlists with related users and items
  const watchlists = await prisma.watchlist.findMany({
    include: {
      user: true,
      items: {
        include: {
          stock: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Server action to create watchlists for users that don't have one
  async function createMissingWatchlists() {
    "use server";

    // Find users without watchlists
    const usersWithoutWatchlists = await prisma.user.findMany({
      where: {
        watchlist: null,
      },
      select: {
        id: true,
      },
    });

    // Create watchlists for these users
    if (usersWithoutWatchlists.length > 0) {
      await Promise.all(
        usersWithoutWatchlists.map((user) =>
          prisma.watchlist.create({
            data: {
              userId: user.id,
            },
          }),
        ),
      );
    }

    revalidatePath("/admin/watchlist");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">User Watchlists</h1>

      {/* Debug info and action button */}
      {usersWithoutWatchlists > 0 && (
        <div className="mb-6 p-4 bg-background border border-red-500 rounded-md">
          <p className="mb-2">
            Found {usersWithoutWatchlists} users without watchlists.
          </p>
          <form action={createMissingWatchlists}>
            <Button type="submit" variant="outline">
              Create Missing Watchlists
            </Button>
          </form>
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

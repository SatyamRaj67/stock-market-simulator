import { Suspense } from "react";
import { WatchlistContent } from "@/components/watchlist/WatchlistContent";
import { EmptyWatchlist } from "@/components/watchlist/WatchlistEmpty";
import { WatchlistSkeleton } from "@/components/watchlist/WatchlistSkeleton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";



const serializeData = (data: any): any=> {
  if (data === null || data === undefined) return data;

  if (typeof data === "object") {
    if (data instanceof Date) {
      return data.toISOString();
    }

    // Handle Decimal objects (recognized by having a 's' property)
    if ("s" in data && "d" in data) {
      return String(data);
    }

    if (Array.isArray(data)) {
      return data.map(serializeData);
    }

    const result: Record<string, any> = {};
    for (const key in data) {
      result[key] = serializeData(data[key]);
    }
    return result;
  }

  return data;
};

export default async function WatchlistPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  // Get or create the user's watchlist
  let watchlistData = await prisma.watchlist.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          stock: true,
        },
      },
    },
  });

  // If no watchlist exists, create one
  if (!watchlistData) {
    watchlistData = await prisma.watchlist.create({
      data: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            stock: true,
          },
        },
      },
    });
  }

  // Transform the data to match the expected types
  const watchlist = serializeData(watchlistData);

  return (
    <main className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Watchlist</h1>
      </div>

      <Suspense fallback={<WatchlistSkeleton />}>
        {watchlist.items.length === 0 ? (
          <EmptyWatchlist watchlistId={watchlist.id} />
        ) : (
          <WatchlistContent
            initialWatchlist={watchlist}
            userId={session.user.id}
          />
        )}
      </Suspense>
    </main>
  );
}

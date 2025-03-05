import { prisma } from "@/lib/prisma";
import { Watchlist, WatchlistItem, Stock } from "@prisma/client";

export type WatchlistWithItems = Watchlist & {
  items: (WatchlistItem & {
    stock: Stock;
  })[];
};

export const watchlistService = {
  /**
   * Find a watchlist by ID
   */
  async findById(id: string): Promise<WatchlistWithItems | null> {
    return prisma.watchlist.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            stock: true,
          },
        },
      },
    });
  },

  /**
   * Find a user's watchlist, creating one if it doesn't exist
   */
  async findOrCreateByUserId(userId: string): Promise<WatchlistWithItems> {
    let watchlist = await prisma.watchlist.findUnique({
      where: {
        userId,
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
    if (!watchlist) {
      watchlist = await prisma.watchlist.create({
        data: {
          userId,
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

    return watchlist;
  },

  /**
   * Add a stock to watchlist
   */
  async addStock(watchlistId: string, stockId: string): Promise<WatchlistItem> {
    return prisma.watchlistItem.create({
      data: {
        watchlistId,
        stockId,
      },
      include: {
        stock: true,
      },
    });
  },

  /**
   * Remove a stock from watchlist
   */
  async removeStock(itemId: string): Promise<void> {
    await prisma.watchlistItem.delete({
      where: { id: itemId },
    });
  },
};

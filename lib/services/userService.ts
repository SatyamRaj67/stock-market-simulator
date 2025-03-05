import { prisma } from "@/lib/prisma";
import { User, Portfolio, Position, Stock } from "@prisma/client";

export type UserWithPortfolio = User & {
  portfolio:
    | (Portfolio & {
        positions: (Position & {
          stock: Stock;
        })[];
      })
    | null;
};

/**
 * User-related database operations
 */
export const userService = {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },


    // Find a user with their portfolio and positions

  async findWithPortfolio(userId: string): Promise<UserWithPortfolio | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolio: {
          include: {
            positions: {
              include: {
                stock: true,
              },
            },
          },
        },
      },
    });
  },

  
    // Update user balance
   
  async updateBalance(userId: string, newBalance: number): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });
  },

  /**
   * Update portfolio value and profit metrics
   */
  async updatePortfolioMetrics(
    userId: string,
    portfolioValue: number,
    totalProfit: number,
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        portfolioValue,
        totalProfit,
      },
    });
  },

  /**
   * Create a user if they don't exist (for auth providers)
   */
  async findOrCreate(data: {
    id?: string;
    email: string;
    name?: string | null;
    image?: string | null;
  }): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) return user;

    return prisma.user.create({
      data: {
        ...data,
        password: "", // Add empty password for OAuth users
        balance: 10000, // Starting balance
        portfolioValue: 0,
        totalProfit: 0,
        portfolio: {
          create: {}, // Create empty portfolio
        },
      },
    });
  },
};

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/options";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      balance: true,
      portfolioValue: true,
      totalProfit: true,
      portfolio: {
        include: {
          positions: {
            include: {
              stock: true,
            },
          },
        },
      },
      transactions: {
        include: {
          stock: true,
        },
        orderBy: {
          timestamp: "desc",
        },
        take: 5,
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

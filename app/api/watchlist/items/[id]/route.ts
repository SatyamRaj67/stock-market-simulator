import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkAdminRole } from "@/lib/utils/roleCheck";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const session = await getServerSession(authOptions);

  const { isAuthorized, response } = checkAdminRole(session);

  if (!isAuthorized) {
    return response;
  }

  try {
    // Find watchlist with all items
    const watchlist = await prisma.watchlist.findUnique({
      where: {
        userId: params.userId,
      },
      include: {
        items: {
          include: {
            stock: true,
          },
          orderBy: {
            addedAt: "desc",
          },
        },
      },
    });

    if (!watchlist) {
      return NextResponse.json(
        { error: "Watchlist not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 },
    );
  }
}

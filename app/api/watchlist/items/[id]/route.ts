import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the watchlist item
    const watchlistItem = await prisma.watchlistItem.findUnique({
      where: { id: params.id },
      include: { watchlist: true },
    });

    if (!watchlistItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Check if the user owns the watchlist or is an admin
    if (
      watchlistItem.watchlist.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the watchlist item
    await prisma.watchlistItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing stock from watchlist:", error);
    return NextResponse.json(
      { error: "Failed to remove stock from watchlist" },
      { status: 500 },
    );
  }
}

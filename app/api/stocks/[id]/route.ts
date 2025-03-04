import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Helper function to check if user is admin
async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;

  const role = session.user.role;
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

// GET single stock by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const stock = await prisma.stock.findUnique({
      where: { id: params.id },
    });

    if (!stock) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    return NextResponse.json(stock);
  } catch (error) {
    console.error("Error fetching stock:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock" },
      { status: 500 },
    );
  }
}

// PUT update stock (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check admin authorization
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const data = await req.json();

    // Check if stock exists
    const exists = await prisma.stock.findUnique({
      where: { id: params.id },
    });

    if (!exists) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    // Update the stock
    const stock = await prisma.stock.update({
      where: { id: params.id },
      data: {
        symbol: data.symbol,
        name: data.name,
        currentPrice: Number(data.currentPrice),
        previousClose: data.previousClose
          ? Number(data.previousClose)
          : undefined,
        openPrice: data.openPrice ? Number(data.openPrice) : undefined,
        highPrice: data.highPrice ? Number(data.highPrice) : undefined,
        lowPrice: data.lowPrice ? Number(data.lowPrice) : undefined,
        volume: data.volume !== undefined ? Number(data.volume) : undefined,
        marketCap: data.marketCap ? Number(data.marketCap) : undefined,
        description: data.description || undefined,
        sector: data.sector || undefined,
      },
    });

    return NextResponse.json(stock);
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { error: "Failed to update stock" },
      { status: 500 },
    );
  }
}

// DELETE stock (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check admin authorization
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    // Check if stock exists
    const exists = await prisma.stock.findUnique({
      where: { id: params.id },
    });

    if (!exists) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    // Delete stock
    await prisma.stock.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Stock deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting stock:", error);
    return NextResponse.json(
      { error: "Failed to delete stock" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { StockFormData } from "@/types";

// Helper function to check if user is admin
async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;

  const role = session.user.role;
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

// GET all stocks (public read access)
export async function GET() {
  try {
    const stocks = await prisma.stock.findMany({
      orderBy: { symbol: "asc" },
    });

    return NextResponse.json(stocks);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch stocks" },
      { status: 500 },
    );
  }
}

// POST create new stock (admin only)
export async function POST(req: NextRequest) {
  try {
    // Check admin authorization
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    // Parse request body
    const data = await req.json() as StockFormData;

    // Validate required fields
    if (!data.symbol || !data.name || !data.currentPrice) {
      return NextResponse.json(
        { error: "Symbol, name, and currentPrice are required" },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);

    // Create the stock
    const stock = await prisma.stock.create({
      data: {
        symbol: data.symbol,
        name: data.name,
        currentPrice: data.currentPrice,
        previousClose: data.previousClose || data.currentPrice,
        openPrice: data.openPrice || data.currentPrice,
        highPrice: data.highPrice || data.currentPrice,
        lowPrice: data.lowPrice || data.currentPrice,
        volume: data.volume || 0,
        marketCap: data.marketCap,
        description: data.description || "",
        sector: data.sector || "Uncategorized",
        createdBy: { connect: { id: session?.user.id },}
      },
    });

    return NextResponse.json(stock, { status: 201 });
  } catch (error) {
    console.error("Error creating stock:", error);
    return NextResponse.json(
      { error: "Failed to create stock" },
      { status: 500 },
    );
  }
}

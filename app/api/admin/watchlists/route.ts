import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper function to serialize data
function serializeData(data) {
  if (data === null || data === undefined) return data;

  if (typeof data === "object") {
    if (data instanceof Date) return data.toISOString();

    // Handle Decimal objects
    if ("s" in data && "d" in data) return String(data);

    if (Array.isArray(data)) return data.map(serializeData);

    const result = {};
    for (const key in data) {
      result[key] = serializeData(data[key]);
    }
    return result;
  }

  return data;
}

// GET all watchlists
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
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

    // Serialize to handle Decimal values
    return NextResponse.json(serializeData(watchlists));
  } catch (error) {
    console.error("Error fetching watchlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlists" },
      { status: 500 },
    );
  }
}

// POST to create missing watchlists
export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    // Find users without watchlists
    const usersWithoutWatchlists = await prisma.user.findMany({
      where: { watchlist: null },
      select: { id: true },
    });

    // Create watchlists for these users
    if (usersWithoutWatchlists.length > 0) {
      await Promise.all(
        usersWithoutWatchlists.map((user) =>
          prisma.watchlist.create({
            data: { userId: user.id },
          }),
        ),
      );
    }

    return NextResponse.json({
      success: true,
      count: usersWithoutWatchlists.length,
    });
  } catch (error) {
    console.error("Error creating watchlists:", error);
    return NextResponse.json(
      { error: "Failed to create watchlists" },
      { status: 500 },
    );
  }
}

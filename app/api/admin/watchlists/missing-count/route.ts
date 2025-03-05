import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkAdminRole } from "@/utils/roleCheck";

export async function GET() {
  const session = await getServerSession(authOptions);

  const { isAuthorized, response } = checkAdminRole(session);

  if (!isAuthorized) {
    return response;
  }

  try {
    // Debug info - count users without watchlists
    const count = await prisma.user.count({
      where: {
        watchlist: null,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting missing watchlists:", error);
    return NextResponse.json(
      { error: "Failed to count missing watchlists" },
      { status: 500 },
    );
  }
}

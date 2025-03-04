import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Define paths that are protected
  const protectedPaths = ["/dashboard", "/portfolio", "/market", "/profile"];

  // Define admin-only paths
  const adminPaths = ["/admin"];

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((protectedPath) =>
    path.startsWith(protectedPath),
  );

  // Check if the path is admin-only
  const isAdminPath = adminPaths.some((adminPath) =>
    path.startsWith(adminPath),
  );

  // If the path is not protected or admin-only, allow access
  if (!isProtectedPath && !isAdminPath) {
    return NextResponse.next();
  }

  // Get the JWT token
  const token = await getToken({ req });

  // If there's no token, redirect to login
  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // If the path is admin-only, check if the user is an admin
  if (isAdminPath && token.role !== "ADMIN" && token.role !== "SUPER_ADMIN") {
    console.log(`Access denied. User role: ${token.role}`);
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow access for authenticated users
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portfolio/:path*",
    "/market/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};

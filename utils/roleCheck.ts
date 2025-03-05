import { NextResponse } from "next/server";
import { Session } from "next-auth";

type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

interface AuthResult {
  isAuthorized: boolean;
  response?: NextResponse;
}
 
export function checkRole(
  session: Session | null,
  allowedRoles: Role[]
): AuthResult {
  // Check if user is authenticated
  if (!session?.user) {
    return {
      isAuthorized: false,
      response: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  // Check if user has one of the allowed roles
  const userRole = session.user.role as Role;
  if (!allowedRoles.includes(userRole)) {
    return {
      isAuthorized: false,
      response: NextResponse.json(
        { error: "You don't have permission to access this resource" },
        { status: 403 }
      ),
    };
  }

  // User is authorized
  return { isAuthorized: true };
}

export function checkAdminRole(session: Session | null): AuthResult {
  return checkRole(session, ["ADMIN", "SUPER_ADMIN"]);
}

export function checkSuperAdminRole(session: Session | null): AuthResult {
  return checkRole(session, ["SUPER_ADMIN"]);
}
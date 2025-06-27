import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "@/lib/jwt";

const publicRoutes = ["/login", "/signup", "/forgot-password"];

export default async function Middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublic = publicRoutes.some((route) => path.startsWith(route));

  // Get token from cookie (old system uses 'auth-token')
  const authToken = req.cookies.get("auth-token")?.value;

  // Check if user is authenticated
  const isAuthenticated = authToken && !isTokenExpired(authToken);

  // If accessing public routes (login, signup) and user is authenticated
  if (isPublic && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If accessing protected routes and user is not authenticated
  if (!isPublic && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};

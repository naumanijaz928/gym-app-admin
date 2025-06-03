import { NextRequest, NextResponse } from "next/server";
const publicRoutes = ["/login", "/register", "/forgot-password"];
export default function Middleware(req: NextRequest) {
  const user = true; // Simulating user authentication state
  const path = req.nextUrl.pathname;

  const isPublic = publicRoutes.some((route) => path.startsWith(route));

  const cookie = req.cookies.get("token")?.value || user;
  //   const session = await decrypt(cookie);

  if (!isPublic && !cookie) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  if (isPublic && cookie) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"], // Match everything except static
};

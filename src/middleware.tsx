import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "./lib/session";
const publicRoutes = ["/login", "/register", "/forgot-password"];
export default async function Middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublic = publicRoutes.some((route) => path.startsWith(route));

  const cookie = req.cookies.get("token")?.value;
  const session = await decrypt(cookie);

  if (!isPublic && !session?.userId) {
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

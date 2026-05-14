import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config"; // ✅ Database-free config

// ✅ NextAuth ko Edge runtime par chalane ke liye adapter hatana zaroori tha
const { auth } = NextAuth(authConfig);

export default auth(function proxy(req) {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/login"].includes(nextUrl.pathname);

  if (isApiAuthRoute) return;

  if (isApiRoute) {
    if (!isLoggedIn) {
      return Response.json(
        { error: "Unauthorized: Please log in to access Axcel Genie APIs" },
        { status: 401 }
      );
    }
    return; 
  }

  if (isPublicRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
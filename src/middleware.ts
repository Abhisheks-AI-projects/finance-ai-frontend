import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Redirect signed-in users away from landing page to home
  if (userId && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  // Redirect old sign-in/sign-up pages to landing
  if (request.nextUrl.pathname.startsWith("/sign-in") || request.nextUrl.pathname.startsWith("/sign-up")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect old routes
  if (request.nextUrl.pathname.startsWith("/dashboard/transactions")) {
    return NextResponse.redirect(new URL("/transactions", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/dashboard/chat")) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/", request.url).toString(),
    });
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

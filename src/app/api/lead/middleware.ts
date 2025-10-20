import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const url = new URL(req.url);

  // Force www
  if (url.hostname !== "www.buddsplumbing.com") {
    url.hostname = "www.buddsplumbing.com";
    return NextResponse.redirect(url, 308);
  }

  // Strip trailing slash (but keep root "/")
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\.(?:png|jpg|jpeg|gif|ico|svg|webp|avif|txt|xml)).*)"],
};

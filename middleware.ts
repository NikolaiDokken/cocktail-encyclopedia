import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.AUTH_SECRET;

const publicPages = ["/", "/login"];

export default async function middleware(req: NextRequest) {
  const isPublicPage = publicPages.includes(req.nextUrl.pathname);
  const token = await getToken({ req: req, secret });

  if (isPublicPage || token) {
    return NextResponse.next(); // Allow access to public pages
  } else {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

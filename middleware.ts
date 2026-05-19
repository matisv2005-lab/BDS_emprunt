import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import authConfig from "@/auth.config"

const { auth } = NextAuth(authConfig)

const PROTECTED_ROUTES = ["/log", "/rendre"]
const ADMIN_ROUTES = ["/admin"]

function isAdmin(role?: string | null) {
  return role === "ADMIN" || role === "SUPER_ADMIN"
}

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const pathname = nextUrl.pathname
  const isAuthenticated = Boolean(session?.user?.id)

  const protectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  )
  const adminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route))

  if ((protectedRoute || adminRoute) && !isAuthenticated) {
    const loginUrl = new URL("/login", nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", nextUrl.href)
    return NextResponse.redirect(loginUrl)
  }

  if (adminRoute && !isAdmin(session?.user?.role)) {
    return NextResponse.redirect(new URL("/log", nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/log",
    "/log/:path*",
    "/rendre",
    "/rendre/:path*",
    "/admin",
    "/admin/:path*",
  ],
}

import { auth } from "@/auth"
import { NextResponse } from "next/server"

export type AppSession = NonNullable<Awaited<ReturnType<typeof auth>>>

export function isAdminRole(role?: string | null) {
  return role === "ADMIN" || role === "SUPER_ADMIN"
}

export function isSuperAdminRole(role?: string | null) {
  return role === "SUPER_ADMIN"
}

export async function requireSession() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  return { session, response: null }
}

export async function requireAdmin() {
  const { session, response } = await requireSession()

  if (response) {
    return { session: null, response }
  }

  if (!isAdminRole(session.user.role)) {
    return {
      session: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return { session, response: null }
}

export async function requireSuperAdmin() {
  const { session, response } = await requireSession()

  if (response) {
    return { session: null, response }
  }

  if (!isSuperAdminRole(session.user.role)) {
    return {
      session: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return { session, response: null }
}

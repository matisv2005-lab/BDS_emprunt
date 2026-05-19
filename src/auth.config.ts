import type { NextAuthConfig } from "next-auth"
import type { Role } from "@prisma/client"

const DEFAULT_REZEL_ISSUER =
  "https://auth.garezeldap.rezel.net/application/o/bds-emprunt/"

type RezelProfile = {
  sub: string
  email?: string
  name?: string
  given_name?: string
  family_name?: string
  preferred_username?: string
}

function displayName(profile: RezelProfile) {
  const fromParts = [profile.given_name, profile.family_name]
    .filter(Boolean)
    .join(" ")
    .trim()

  return (
    profile.name?.trim() ||
    fromParts ||
    profile.preferred_username?.trim() ||
    profile.email?.trim() ||
    profile.sub
  )
}

export const authConfig = {
  secret:
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV === "production"
      ? undefined
      : "dev-only-bds-emprunt-auth-secret-change-me"),
  trustHost: true,
  providers: [
    {
      id: "rezel",
      name: "Rezel Connect",
      type: "oidc",
      issuer: process.env.REZEL_ISSUER_URL ?? DEFAULT_REZEL_ISSUER,
      clientId: process.env.REZEL_CLIENT_ID,
      clientSecret: process.env.REZEL_CLIENT_SECRET,
      authorization: {
        params: { scope: "openid email profile" },
      },
      checks: ["pkce", "state"],
      profile(profile: RezelProfile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: displayName(profile),
        }
      },
    },
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, token }) {
      const dbUserId = typeof token.dbUserId === "string" ? token.dbUserId : undefined
      const sub = typeof token.sub === "string" ? token.sub : undefined
      const rezelId = typeof token.rezelId === "string" ? token.rezelId : undefined

      session.user.id = dbUserId ?? sub ?? ""
      session.user.role = (token.role as Role | undefined) ?? "USER"
      session.user.rezelId = rezelId
      return session
    },
  },
} satisfies NextAuthConfig

export default authConfig

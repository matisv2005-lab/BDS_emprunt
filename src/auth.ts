import NextAuth from "next-auth"
import type { Role } from "@prisma/client"
import authConfig from "@/auth.config"
import { prisma } from "@/lib/prisma"

type RezelProfile = {
  sub?: string
  email?: string
  name?: string
  given_name?: string
  family_name?: string
  preferred_username?: string
}

function splitName(profile: RezelProfile) {
  const display =
    profile.name?.trim() ||
    [profile.given_name, profile.family_name].filter(Boolean).join(" ").trim() ||
    profile.preferred_username?.trim() ||
    profile.email?.split("@")[0] ||
    "Utilisateur"

  return {
    nom: profile.family_name?.trim() || display.split(" ").slice(1).join(" ") || display,
    prenom: profile.given_name?.trim() || display.split(" ")[0] || "Utilisateur",
  }
}

function fallbackEmail(profile: RezelProfile) {
  return profile.email?.trim() || `${profile.sub}@rezel.local`
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, account, profile }) {
      // DEMO UNIQUEMENT — connexion directe sans Rezel ni DB
      if (account?.provider === "demo-admin") {
        token.dbUserId = "demo-admin"
        token.role = "SUPER_ADMIN" as Role
        token.name = "Admin Demo BDS"
        token.email = "admin@demo.local"
        return token
      }

      if (account?.provider === "rezel" && profile) {
        const rezelProfile = profile as RezelProfile

        if (!rezelProfile.sub) {
          return token
        }

        const { nom, prenom } = splitName(rezelProfile)
        const email = fallbackEmail(rezelProfile)

        const user = await prisma.utilisateur.upsert({
          where: { rezelId: rezelProfile.sub },
          update: {
            email,
            nom,
            prenom,
          },
          create: {
            rezelId: rezelProfile.sub,
            email,
            nom,
            prenom,
            role: "USER",
          },
        })

        token.sub = user.id
        token.dbUserId = user.id
        token.rezelId = user.rezelId
        token.role = user.role
        token.name = `${user.prenom} ${user.nom}`.trim()
        token.email = user.email
        return token
      }

      if ((token.dbUserId ?? token.sub) && token.dbUserId !== "demo-admin") {
        const user = await prisma.utilisateur.findUnique({
          where: { id: String(token.dbUserId ?? token.sub) },
          select: {
            id: true,
            rezelId: true,
            role: true,
            email: true,
            nom: true,
            prenom: true,
          },
        })

        if (user) {
          token.sub = user.id
          token.dbUserId = user.id
          token.rezelId = user.rezelId
          token.role = user.role
          token.name = `${user.prenom} ${user.nom}`.trim()
          token.email = user.email
        }
      }

      return token
    },
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
})

import { PrismaClient, Role } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SEED_SUPER_ADMIN_EMAIL
  const rezelId = process.env.SEED_SUPER_ADMIN_REZEL_ID
  const nom = process.env.SEED_SUPER_ADMIN_NOM ?? "Admin"
  const prenom = process.env.SEED_SUPER_ADMIN_PRENOM ?? "BDS"

  if (!email || !rezelId) {
    console.warn(
      "SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_REZEL_ID are required to seed the first SUPER_ADMIN.",
    )
    return
  }

  const user = await prisma.utilisateur.upsert({
    where: { rezelId },
    update: {
      email,
      nom,
      prenom,
      role: Role.SUPER_ADMIN,
    },
    create: {
      rezelId,
      email,
      nom,
      prenom,
      role: Role.SUPER_ADMIN,
    },
  })

  console.log(`SUPER_ADMIN seeded: ${user.email} (${user.id})`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

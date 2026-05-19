import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, requireSuperAdmin } from "@/lib/api-auth"
import { readPayload } from "@/lib/request"

export async function GET() {
  const { response } = await requireAdmin()
  if (response) return response

  const users = await prisma.utilisateur.findMany({
    include: {
      tickets: true,
      emprunts: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(users)
}

export async function POST(req: Request) {
  const { response } = await requireSuperAdmin()
  if (response) return response

  const body = await readPayload(req)
  const user = await prisma.utilisateur.create({
    data: {
      rezelId: body.rezelId,
      nom: body.nom,
      prenom: body.prenom,
      email: body.email,
      role: body.role ?? "USER",
    },
  })
  return NextResponse.json(user)
}

export async function PUT(req: Request) {
  const { response } = await requireSuperAdmin()
  if (response) return response

  const body = await readPayload(req)
  const updated = await prisma.utilisateur.update({
    where: {
      id: body.id,
    },
    data: {
      nom: body.nom,
      prenom: body.prenom,
      email: body.email,
      role: body.role,
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request) {
  const { response } = await requireSuperAdmin()
  if (response) return response

  const body = await readPayload(req)
  await prisma.utilisateur.delete({
    where: {
      id: body.id,
    },
  })
  return NextResponse.json({ success: true })
}

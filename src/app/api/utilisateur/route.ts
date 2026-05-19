import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const users = await prisma.utilisateur.findMany({
    include: {
      tickets: true,
      emprunts: true,
    },
  })

  return NextResponse.json(users)
}

export async function POST(req: Request) {
  const body = await req.json()
  const user = await prisma.utilisateur.create({
    data: {
      nom: body.nom,
      prenom: body.prenom,
      email: body.email,
      role: body.role,
    },
  })
  return NextResponse.json(user)
}

export async function PUT(req: Request) {
  const body = await req.json()
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
  const body = await req.json()
  await prisma.utilisateur.delete({
    where: {
      email: body.email,
    },
  })
  return NextResponse.json({ success: true })
}
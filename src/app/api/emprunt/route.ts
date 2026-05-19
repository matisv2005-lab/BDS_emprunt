import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdminRole, requireAdmin, requireSession } from "@/lib/api-auth"
import { readPayload } from "@/lib/request"

type MaterialPayload = {
  inventaireId?: string
  quantite?: number
  inventaire?: { id?: string | null }
}

function normalizeMateriels(materiels: MaterialPayload[] = []) {
  return materiels
    .map((materiel) => ({
      inventaireId: materiel.inventaireId ?? materiel.inventaire?.id ?? "",
      quantite: Number(materiel.quantite ?? 0),
    }))
    .filter((materiel) => materiel.inventaireId && materiel.quantite > 0)
}

function parseDate(date: unknown) {
  if (typeof date !== "string" || !date) return new Date()
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

//Pour renvoyer les emprunts associé à un utilisateur
//Est appelée par /rendre
export async function GET(req: Request) {
  const { session, response } = await requireSession()
  if (response) return response

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const canSeeAll = isAdminRole(session.user.role)

  const emprunts = await prisma.emprunt.findMany({
    where: {
      userId: canSeeAll ? userId || undefined : session.user.id,
    },
    include: {
      materiels: {
        include: {
          inventaire: true,
        },
      },
    },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(emprunts)
}

//Pour Créer un nouvel emrunt
//post de /admin qd on valide un ticket
export async function POST(req: Request) {
  const { response } = await requireAdmin()
  if (response) return response

  const body = await readPayload(req)
  const materiels = normalizeMateriels(body.materiels)

  if (!body.userId) {
    return NextResponse.json({ error: "Utilisateur manquant" }, { status: 400 })
  }

  if (materiels.length === 0) {
    return NextResponse.json({ error: "Aucun matériel fourni" }, { status: 400 })
  }

  const emprunt = await prisma.emprunt.create({
    data: {
      date: parseDate(body.date),
      userId: body.userId,
      materiels: {
        create: materiels,
      },
    },
    include: {
      materiels: {
        include: {
          inventaire: true,
        },
      },
    },
  })

  return NextResponse.json(emprunt)
}
//Pour supprimer un emprunt
//delete de /admin qd on valide un ticket de type rendu
export async function DELETE(req: Request) {
  const { response } = await requireAdmin()
  if (response) return response

  const body = await readPayload(req)
  if (!body.id) {
    return NextResponse.json({ error: "Emprunt id manquant" }, { status: 400 })
  }

  await prisma.emprunt.delete({
    where: {id: body.id,},})
  return NextResponse.json({ success: true })
}

//Modification manuelle de /admin
export async function PUT(req: Request) {
  const { response } = await requireAdmin()
  if (response) return response

  const body = await readPayload(req)
  const materiels = normalizeMateriels(body.materiels)

  if (!body.id) {
    return NextResponse.json({ error: "Emprunt id manquant" }, { status: 400 })
  }

  const updated = await prisma.emprunt.update({
    where: {
      id: body.id,
    },

    data: {
      date: parseDate(body.date),
      userId: body.userId,
      materiels: {
        deleteMany: {},
        create: materiels,
      },
    },
    include: {
      materiels: {
        include: {
          inventaire: true,
        },
      },
    },
  })

  return NextResponse.json(updated)
}

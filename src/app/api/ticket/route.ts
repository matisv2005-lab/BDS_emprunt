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

function parseTicketDate(date: unknown) {
  if (typeof date !== "string" || !date) return undefined
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

//Pour renvoyer les tickets associé à un utilisateur
//Est appelée par /admin pour afficher les tickets en attente de validation
export async function GET(req: Request) {
  const { session, response } = await requireSession()
  if (response) return response

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const canSeeAll = isAdminRole(session.user.role)

  const tickets = await prisma.ticket.findMany({
    where: {
      userId: canSeeAll ? userId || undefined : session.user.id,
    },
    include: {
      materiels: {
        include: {
          inventaire: true,
        },
      },
      user: true,
    },
    orderBy: { date: "desc" },
  })
  return NextResponse.json(tickets)
}

//post par /accueil ou /admin pour créer des tickets d'emprunt ou de rendu
export async function POST(req: Request) {
  const { session, response } = await requireSession()
  if (response) return response

  const body = await readPayload(req)
  const materiels = normalizeMateriels(body.materiels)

  if (body.type !== "Emprunt" && body.type !== "Rendu") {
    return NextResponse.json({ error: "Type de ticket invalide" }, { status: 400 })
  }

  if (materiels.length === 0) {
    return NextResponse.json({ error: "Aucun matériel fourni" }, { status: 400 })
  }

  const ticket = await prisma.ticket.create({
    data: {
      type: body.type, // Emprunt / Rendu
      message: body.message,
      userId: isAdminRole(session.user.role) && body.userId ? body.userId : session.user.id,

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

  return NextResponse.json(ticket)
}

//commande admin
export async function PUT(req: Request) {
  const { response } = await requireAdmin()
  if (response) return response

  const body = await readPayload(req)
  const materiels = normalizeMateriels(body.materiels)

  if (!body.id) {
    return NextResponse.json({ error: "Ticket id manquant" }, { status: 400 })
  }

  const updated = await prisma.ticket.update({
    where: {
      id: body.id,
    },
    data: {
      type: body.type, // Emprunt / Rendu
      date : parseTicketDate(body.date),
      message: body.message,
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

//commande admin
export async function DELETE(req: Request) {
  const { response } = await requireAdmin()
  if (response) return response

  const body = await readPayload(req)
  if (!body.id) {
    return NextResponse.json({ error: "Ticket id manquant" }, { status: 400 })
  }

  await prisma.ticket.delete({where: {id: body.id,},})
  return NextResponse.json({ success: true })
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

//Pour renvoyer les tickets associé à un utilisateur
//Est appelée par /admin pour afficher les tickets en attente de validation
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const tickets = await prisma.ticket.findMany({
    where: {
      userId: userId || undefined,
    },
    include: {
      materiels: {
        include: {
          inventaire: true,
        },
      },
      user: true,
    },
  })
  return NextResponse.json(tickets)
}

//post par /accueil ou /admin pour créer des tickets d'emprunt ou de rendu
export async function POST(req: Request) {
  const body = await req.json()
  const ticket = await prisma.ticket.create({
    data: {
      type: body.type, // Emprunt / Rendu
      message: body.message,
      userId: body.userId,

      materiels: {
        create: body.materiels.map((m: any) => ({
          inventaireId: m.inventaireId,
          quantite: m.quantite,
        })),
      },
    },
    include: {
      materiels: true,
    },
  })

  return NextResponse.json(ticket)
}

//commande admin
export async function PUT(req: Request) {
  const body = await req.json()
  const updated = await prisma.ticket.update({
    where: {
      id: body.id,
    },
    data: {
      type: body.type, // Emprunt / Rendu
      date : body.date,
      message: body.message,
      userId: body.userId,
      materiels: {
        deleteMany: {},
        create: body.materiels.map((m: any) => ({
          inventaireId: m.inventaireId,
          quantite: m.quantite,
          ticketId: body.id,
        })),
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
  const body = await req.json()
  await prisma.ticket.delete({where: {id: body.id,},})
  return NextResponse.json({ success: true })
}
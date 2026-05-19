import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

//Pour renvoyer les emprunts associé à un utilisateur
//Est appelée par /rendre
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const emprunts = await prisma.emprunt.findMany({
    where: {
      userId: userId || undefined,
    },
    include: {
      materiels: {
        include: {
          inventaire: true,
        },
      },
    },
  })

  return NextResponse.json(emprunts)
}

//Pour Créer un nouvel emrunt
//post de /admin qd on valide un ticket
export async function POST(req: Request) {
  const body = await req.json()
  const emprunt = await prisma.emprunt.create({
    data: {
      date: body.date,
      userId: body.userId,
      materiels: {
        create: body.materiels.map((m: any) => ({
          inventaireId: m.inventaireId,
          quantite: m.quantite,
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

  return NextResponse.json(emprunt)
}
//Pour supprimer un emprunt
//delete de /admin qd on valide un ticket de type rendu
export async function DELETE(req: Request) {
  const body = await req.json()
  await prisma.emprunt.delete({
    where: {id: body.id,},})
  return NextResponse.json({ success: true })
}

//Modification manuelle de /admin
export async function PUT(req: Request) {

  const body = await req.json()

  const updated = await prisma.emprunt.update({
    where: {
      id: body.id,
    },

    data: {
      date: body.date,
      userId: body.userId,
      materiels: {
        deleteMany: {},
        create: body.materiels.map((m: any) => ({
          inventaireId: m.inventaireId,
          quantite: m.quantite,
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
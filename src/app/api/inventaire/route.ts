{/*
  

A FAIRE LORSQU ON RECOIT UN TICKET ON SAIT QU ON MAJ LA bdd SELON LE TYPE DU RENDU


  import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


// AJOUTER
export async function POST(req: Request) {

  const body = await req.json()

  const materiel = await prisma.inventaire.create({
    data: {
      description: body.description,
      quantite: body.quantite,
      info: body.info,
    },
  })
  return NextResponse.json(materiel)
}

//DELETE 
export async function DELETE(req: Request) {

  const body = await req.json()

  await prisma.inventaire.delete({
    where: {
      id: body.id,
    },
  })

  return NextResponse.json({ success: true })
}

//MAJ
export async function PUT(req: Request) {
  const body = await req.json()
  const updated = await prisma.inventaire.update({
    where: {
      id: body.id,
    },
    data: {
      description: body.description,
      quantite: body.quantite,
      info: body.info,
    },
  })
  return NextResponse.json(updated)
}

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)

  const userId = searchParams.get("userId")

  const tickets = await prisma.ticket.findMany({
    where: {
      userId: userId || undefined,
    },
  })

  return NextResponse.json(tickets)
}
  
*/}
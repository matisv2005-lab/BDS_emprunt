import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

//Renvoie l'inventaire
//Est appelée par /log
export async function GET(req: Request) {
  const inventaires = await prisma.inventaire.findMany()
  return NextResponse.json(inventaires)
}

//Commande de /admin pour ajouter un matériel à l'inventaire
export async function POST(req: Request) {
  const body = await req.json()
  const inventaire = await prisma.inventaire.create({
    data: {
      description: body.description,
      stock: body.stock,
      info: body.info,
    },
  })
  return NextResponse.json(inventaire)
}

//Pour supprimer un inventaire : commande /admin
export async function DELETE(req: Request) {
  const body = await req.json()
  await prisma.inventaire.delete({
    where: {id: body.id,},})
  return NextResponse.json({ success: true })
}

//Maj lors de validaiton de ticket de type emprunt ou rendu par /admin
//Modification manuelle de /admin
export async function PUT(req: Request) {
  const body = await req.json()
  const existing = await prisma.inventaire.findUnique({where: {id: body.id,},})
  if (!existing) {
  return NextResponse.json(
    {error:"Matériel introuvable"},{status: 404})
  }
  else{
    const updated = await prisma.inventaire.update({
      where: {
        id: body.id,
      },

      data: {
        description: body.description,
        stock: body.stock + existing.stock,
        info: body.info,
      },
    })
    return NextResponse.json(updated)
  }
}
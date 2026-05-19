import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, requireSession } from "@/lib/api-auth"
import { readPayload } from "@/lib/request"

//Renvoie l'inventaire
//Est appelée par /log
export async function GET() {
  const { response } = await requireSession()
  if (response) return response

  const inventaires = await prisma.inventaire.findMany()
  return NextResponse.json(inventaires)
}

//Commande de /admin pour ajouter un matériel à l'inventaire
export async function POST(req: Request) {
  const { response } = await requireAdmin()
  if (response) return response

  const body = await readPayload(req)
  const inventaire = await prisma.inventaire.create({
    data: {
      description: body.description,
      stock: Number(body.stock ?? body.quantite ?? 0),
      info: body.info,
    },
  })
  return NextResponse.json(inventaire)
}

//Pour supprimer un inventaire : commande /admin
export async function DELETE(req: Request) {
  const { response } = await requireAdmin()
  if (response) return response

  const body = await readPayload(req)
  if (!body.id) {
    return NextResponse.json({ error: "Matériel id manquant" }, { status: 400 })
  }

  await prisma.inventaire.delete({
    where: {id: body.id,},})
  return NextResponse.json({ success: true })
}

//Maj lors de validaiton de ticket de type emprunt ou rendu par /admin
//Modification manuelle de /admin
export async function PUT(req: Request) {
  const { response } = await requireAdmin()
  if (response) return response

  const body = await readPayload(req)
  if (!body.id) {
    return NextResponse.json({ error: "Matériel id manquant" }, { status: 400 })
  }

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
        description: body.description ?? existing.description,
        stock: Number(body.stock ?? body.quantite ?? 0) + existing.stock,
        info: body.info ?? existing.info,
      },
    })
    return NextResponse.json(updated)
  }
}

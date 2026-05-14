{/*import { NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

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
}*/}
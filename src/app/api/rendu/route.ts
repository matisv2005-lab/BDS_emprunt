import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    { error: "Utilise /api/ticket avec type=Rendu pour créer une demande de rendu." },
    { status: 404 },
  )
}

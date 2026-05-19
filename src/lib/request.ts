export async function readPayload(req: Request) {
  const body = await req.json().catch(() => ({}))

  if (body && typeof body === "object") {
    if ("contenu" in body) return body.contenu
    if ("ticket" in body) return body.ticket
  }

  return body
}

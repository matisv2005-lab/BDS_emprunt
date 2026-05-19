import { auth } from "@/auth"
import { isAdminRole } from "@/lib/api-auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin")
  }

  if (!isAdminRole(session.user.role)) {
    redirect("/log")
  }

  return children
}

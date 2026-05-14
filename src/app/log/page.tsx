import Link from "next/link"

export const metadata = {
  title: "Site emprunt BDS",
  description: "Application de gestion de matériel",
}
import Accueil_emp from "./acceuil"

export default function Page() {
  return (
    <div>
      <Accueil_emp/>
    </div>
  )
}
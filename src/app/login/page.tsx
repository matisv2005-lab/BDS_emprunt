import { signIn } from "@/auth"
import Link from "next/link"

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams
  const redirectTo = callbackUrl || "/log"

  return (
    <main className="min-h-screen px-6 flex items-center justify-center bg-slate-950 text-white">
      <section className="w-full max-w-sm border border-white/15 bg-white/5 p-6">
        <p className="text-sm text-white/60">BDS Emprunt</p>
        <h1 className="mt-2 text-2xl font-semibold">Connexion Rezel</h1>
        <p className="mt-3 text-sm text-white/65">
          Connecte-toi avec ton compte Rezel pour accéder aux emprunts de
          matériel.
        </p>
        <form
          className="mt-6"
          action={async () => {
            "use server"
            // En dev : connexion directe admin sans passer par Rezel
            if (process.env.NODE_ENV !== "production") {
              await signIn("demo-admin", { redirectTo })
            } else {
              await signIn("rezel", { redirectTo })
            }
          }}
        >
          <button
            type="submit"
            className="w-full bg-white px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-white/90"
          >
            Se connecter avec Rezel
          </button>
        </form>
        <Link
          href="/"
          className="mt-4 block text-center text-sm text-white/55 hover:text-white"
        >
          Retour accueil
        </Link>
      </section>
    </main>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import type { Emprunt, Emprunt_mat_inventaire } from "@/type/type"

export default function RenduEmp() {
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"
    const typage = {date : new Date().toISOString(), materiels : []}
    const [data_bdd, setData] = useState<Emprunt>(typage)
    const[rendu,setRendu] = useState<Emprunt>(typage)

    //on l'appelle qu'une seule fois au chargement
    useEffect(() => {
        let cancelled = false

        async function recup_emprunt(){
            //Récupère les emprunts de l'utilisateur connecté
            try{
            const response = await fetch("/api/emprunt")
                const data = await response.json()
                const emprunts = Array.isArray(data) ? data : [data]
                if (!cancelled) {
                    setData({
                        date: new Date().toISOString(),
                        materiels: emprunts.flatMap((emprunt: Emprunt) => emprunt.materiels ?? []),
                    })
                }
            } 
            catch(error){console.error("Erreur_recup_emprunt:",error)}
        }

        recup_emprunt()

        return () => {
            cancelled = true
        }
    }, [])

   function add(materiel : Emprunt_mat_inventaire,prev : Emprunt_mat_inventaire[], i : number) : Emprunt_mat_inventaire[]{
        if(materiel.quantite === 0 && i === -1){ return prev}
        else{
            const exist = prev.find((elt) => elt.inventaire.description=== materiel.inventaire.description);
            const new_mat : Emprunt_mat_inventaire = {inventaire : materiel.inventaire, quantite : 0, id: materiel.id};
            if(exist === undefined){
                new_mat.quantite = 1
            }
            else{new_mat.quantite = exist.quantite + i}
            const buff = prev.filter((elt) => elt.inventaire.id !== materiel.inventaire.id);
            // si la quantite atteint 0 on retire la ligne plutot que de l'afficher a 0
            if(new_mat.quantite <= 0) return buff
            return [new_mat,...buff]
        }
    }

    function rendre(materiel: Emprunt_mat_inventaire) {
        // verifie que la quantite disponible est > 0 avant de rendre
        const current = data_bdd.materiels.find(elt => elt.inventaire.id === materiel.inventaire.id)
        if(!current || current.quantite <= 0) return

        // enlève le matériel de data_bdd
        setData((prev) =>{ return {...prev, materiels : add(materiel,prev.materiels,-1) } })
        // ajoute dans la liste du panier
        if(materiel.quantite > 0){
            setRendu((prev) => { return {...prev , materiels : add(materiel,prev.materiels,1)} } )
        }
    }

    function annuler(materiel : Emprunt_mat_inventaire) {
        if(materiel.quantite > 0){
            setData((prev) =>{ return {...prev, materiels : add(materiel,prev.materiels,1) } })
            if(materiel.quantite === 1){ setRendu((prev) => {
                return { ...prev, 
                materiels : prev.materiels.filter((elt) => elt.inventaire.id !== materiel.inventaire.id)}}) } 
            else{ setRendu((prev) => { return {...prev , materiels : add(materiel,prev.materiels,-1)} } )
            }
        }
    } 
    
    async function rendre_vrm(){
        //logique de rendu : envoie un ticket de type rendu à la BDD_tickets puis on vide le panier de rendu
        const ticket = {type : "Rendu", materiels : rendu.materiels}
        const response = await fetch("/api/ticket",{
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify(ticket),
        })
        const data = await response.json()
        console.log(data)
        setRendu({date: new Date().toISOString(), materiels: []})
    }

    return (
    <div>

    <nav>
        <Link href="/log">Emprunter</Link>
        <button type="button" onClick={() => signOut({ callbackUrl: "/" })}>Déconnexion</button>
        {isAdmin && <Link href="/admin">Admin</Link>}
    </nav>

    <form>
        <label htmlFor="materiel-history">Matériel emprunté acutellement :</label>

        <br/>

        <table border={1} id="materiel-history">
            <thead id="materiel-header">
                <tr>
                    <th>Rendre</th><th>Matériel</th><th>Quantité empruntée</th><th>Message</th>
                </tr>
            </thead>
            <tbody id="materiel-body">
                {data_bdd.materiels.map((elt, i) => (
                    <tr key={i}>
                    <td>
                        <button  type="button" onClick={() => rendre(elt)}>+</button>
                    </td>
                    <td>{elt.inventaire.description}</td>
                    <td>{elt.quantite}</td>
                    <td>{elt.inventaire.info}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        <label htmlFor="materiel-table">Matériel prêt à être rendu :</label>

        <br/>

        <table border={1} id="materiel-table">
            <thead id="materiel-header">
                <tr>
                    <th>Annuler</th><th>Matériel</th><th>Quantité rendue</th><th>Message</th>
                </tr>
            </thead>
            <tbody id="materiel-body">
                {rendu.materiels.map((elt, i) => (
                    <tr key={i}>
                    <td>
                        <button  type="button" onClick={() => annuler(elt)}>-</button>
                    </td>
                    <td>{elt.inventaire.description}</td>
                    <td>{elt.quantite}</td>
                    <td>{elt.inventaire.info}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <button type="button" onClick={() => rendre_vrm()}>Rendre</button>
    </form>

    </div>
  )
}

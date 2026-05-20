"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import type { Ticket, Inventaire, Ticket_mat_inventaire } from "@/type/type"


export default function AccueilEmp() {
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"

    // UseState conserve des données d’un rendu à l’autre et 
    // Déclenche un rendu React du composant avec ces nouvelles données
    const [sport, setSport] = useState("Tennis")
    const [data_bdd, setData] = useState<Inventaire[]>([])
    const[panier,setPanier] = useState<Ticket>({type : "Emprunt" , date : new Date().toISOString(), materiels : []})
    
    async function requete_bdd(method : string, contenu: unknown, table : string){
        const response = await fetch("/api/" + table,{
        method: method,
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify(contenu),
        })
        await response.json()
    }
    
    // update quand sport change
    useEffect(() => {
        let cancelled = false

        async function recup_inv(){
            try{
                const response = await fetch("/api/inventaire")
                const data = await response.json()
                if (!cancelled) setData(data)
            } 
            catch(error){console.error("Erreur_recup_inventaire:",error)}
        }

        recup_inv()

        return () => {
            cancelled = true
        }
    }, [sport])

    function add(materiel : Ticket_mat_inventaire,prev : Ticket_mat_inventaire[], i : number) : Ticket_mat_inventaire[]{
            if(materiel.quantite === 0 && i === -1){ return prev}
            else{
                const exist = prev.find((elt) => elt.inventaire.description=== materiel.inventaire.description);
                const new_mat : Ticket_mat_inventaire = {inventaire : materiel.inventaire, quantite : 0, id: materiel.id};
                if(exist === undefined){new_mat.quantite = 1}
                else{new_mat.quantite = exist.quantite + i}
                const buff = prev.filter((elt) => elt.inventaire.id !== materiel.inventaire.id);
                // si la quantite atteint 0 on retire la ligne plutot que de l'afficher a 0
                if(new_mat.quantite <= 0) return buff
                return [new_mat,...buff]
            }
        }

    function emprunter(materiel: Ticket_mat_inventaire) {
            // verifie que le stock est disponible avant d'emprunter
            const current = data_bdd.find(elt => elt.id === materiel.inventaire.id)
            if (!current || current.stock <= 0) return

            // enlève le matériel de data_bdd
            setData((prev) =>
                prev.map((elt) =>
                    elt.description === materiel.inventaire.description && materiel.quantite !== 0
                        ? { ...elt, stock: elt.stock - 1 }
                        : elt
                )
            )
            // ajoute dans la liste du panier
            if(materiel.quantite > 0){
                setPanier((prev) => { return {...prev , materiels : add(materiel,prev.materiels,1)} } )
            }
        }

    function annuler(materiel : Ticket_mat_inventaire) {
        if(materiel.quantite > 0){
            setData((prev) =>
                prev.map((elt) =>
                    elt.description === materiel.inventaire.description
                        ? { ...elt, stock: elt.stock + 1 }
                        : elt
                )
            )
            if(materiel.quantite === 1){ setPanier((prev) => {
                return { ...prev, 
                materiels : prev.materiels.filter((elt) => elt.inventaire.id !== materiel.inventaire.id)}}) } 
            else{ setPanier((prev) => { return {...prev , materiels : add(materiel,prev.materiels,-1)} } )
            }
        }
    } 
    

    async function valider_vrm(){
        // lorsqu'on valide : on envoie le ticket à la BDD_tickets
        if(panier.materiels.length === 0) return
        const ticket = {type : "Emprunt", materiels : panier.materiels}
        await requete_bdd("POST", ticket, "ticket")
        setPanier({type : "Emprunt" , date : new Date().toISOString(), materiels : []})
    }

    return (
    <div>

    <nav>
        <Link href="/rendre">Rendre</Link>
        <button type="button" onClick={() => signOut({ callbackUrl: "/" })}>Déconnexion</button>
        {isAdmin && <Link href="/admin">Admin</Link>}
    </nav>

    <div>
        <label htmlFor="sport-select">Choisir un sport :</label>
        <select
            id="sport-select"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
      >
            <option value="Tennis">Tennis</option>
            <option value="Pétanque">Pétanque</option>
            <option value="Basket">Basket</option>
        </select>

        <br/>

        <label htmlFor="materiel-table">Matériel disponible :</label>

        <br/>

        <table border={1} id="materiel-table">
            <thead id="materiel-header">
                <tr>
                    <th>Emprunter</th><th>Matériel</th><th>Quantité</th><th>Message</th>
                </tr>
            </thead>
            <tbody id="materiel-body">
                {data_bdd.map((elt, i) => (
                    <tr key={i}>
                    <td>
                        <button onClick={() => emprunter({quantite : 1,inventaire : elt})}>+</button>
                    </td>
                    <td>{elt.description}</td>
                    <td>{elt.stock}</td>
                    <td>{elt.info}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <br/>

        <table border={1} id="emp-table">
            <thead id="materiel-header">
                <tr>
                    <th>Annuler</th><th>Matériel</th><th>Quantité</th><th>Message</th>
                </tr>
            </thead>
            <tbody id="materiel-body">
                {panier.materiels.map((elt, i) => (
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
        <button type="button" onClick={() => valider_vrm()}>Emprunter</button>

    </div>

    </div>
  )
}

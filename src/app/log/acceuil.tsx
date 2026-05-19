"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { Ticket, Inventaire, TypeTicket, Ticket_mat_inventaire } from "@/type/type"


export default function accueil_emp() {

    function get_info(){return{date : "18/25/26", userId : "6156"}}

    // UseState conserve des données d’un rendu à l’autre et 
    // Déclenche un rendu React du composant avec ces nouvelles données
    const [sport, setSport] = useState("Tennis")
    const [data_bdd, setData] = useState<Inventaire[]>([])
    const[panier,setPanier] = useState<Ticket>({type : "Emprunt" , date : get_info().date, userId : get_info().userId, materiels : []})
    
    async function requete_bdd(method : string, contenu: any, table : string){
        const response = await fetch("/api/" + table,{
        method: method,
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({contenu}),
        })
        const data = await response.json()
        console.log(data)
    }
    
    // Récupère les infos de la BDD du matériel dispo pour le sport du select
    // TODO : utiliser sport dans select pour filtrer les données de la BDD_inventaire reçu
    async function recup_inv(sport : string){
        try{
            const response = await fetch("/api/inventaire")
            const data = await response.json()
            setData(data)
        } 
        catch(error){console.error("Erreur_recup_inventaire:",error)}
    }

    // update quand sport change
    useEffect(() => {
        recup_inv(sport)
    }, [sport])

    function add(materiel : Ticket_mat_inventaire,prev : Ticket_mat_inventaire[], i : number) : Ticket_mat_inventaire[]{
            if(materiel.quantite === 0 && i === -1){ return prev}
            else{
                let exist = prev.find((elt) => elt.inventaire.description=== materiel.inventaire.description);
                let new_mat : Ticket_mat_inventaire = {inventaire : materiel.inventaire, quantite : 0, id: materiel.id};
                if(exist === undefined){new_mat.quantite = 1}
                else{new_mat.quantite = exist.quantite + i}
                let buff = prev.filter((elt) => elt.inventaire.id !== materiel.inventaire.id);
                return [new_mat,...buff]
            }
        }

    function emprunter(materiel: Ticket_mat_inventaire) {
            // enlève le matériel de data_bdd
            setData((prev) =>{
                for(const elt of prev){
                    if(materiel.inventaire.description === elt.description){
                        if(materiel.quantite !== 0){ elt.stock = elt.stock -1 }
                    }
                }
                return prev
            })
            // ajoute dans la liste du panier
            if(materiel.quantite > 0){
                setPanier((prev) => { return {...prev , materiels : add(materiel,prev.materiels,1)} } )
            }
        }

    function annuler(materiel : Ticket_mat_inventaire) {
        if(materiel.quantite > 0){
            setData((prev) =>{
                for(const elt of prev){
                    if(materiel.inventaire.description === elt.description){
                        elt.stock = elt.stock + 1
                    }
                }
                return prev
             })
            if(materiel.quantite === 1){ setPanier((prev) => {
                return { ...prev, 
                materiels : prev.materiels.filter((elt) => elt.inventaire.id !== materiel.inventaire.id)}}) } 
            else{ setPanier((prev) => { return {...prev , materiels : add(materiel,prev.materiels,1)} } )
            }
        }
    } 
    

    function valider_vrm(){
        // lorsqu'on valide : on envoie le ticket à la BDD_tickets
        let ticket = {type : "Emprunt", date : get_info().date, userId : get_info().userId, materiels : panier.materiels}
        requete_bdd("POST", ticket, "ticket")
        setPanier({type : "Emprunt" , date : get_info().date, userId : get_info().userId, materiels : []})
    }

    return (
    <div>

    <nav>
        <Link href="/rendre">Rendre</Link>
        <Link href="/">Déconnexion</Link>
        <Link href="/admin">Admin</Link>
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
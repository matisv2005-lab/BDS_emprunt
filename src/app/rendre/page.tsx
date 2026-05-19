"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { Emprunt, Emprunt_mat_inventaire,  } from "@/type/type"
import { userInfo } from "os"

export default function rendu_emp() {

    function get_info(){return{date : "18/25/26", userId : "6156"}}

    const typage = {date : get_info().date, userId : get_info().userId, materiels : []}
    const [data_bdd, setData] = useState<Emprunt>(typage)
    const[rendu,setRendu] = useState<Emprunt>(typage)

    async function recup_emprunt(){
        //Récupère les emprunts de l'utilisateur connecté
        try{
        const response = await fetch(`/api/emprunt?userId=${get_info().userId}`)
            const data = await response.json()
            setData(data)
        } 
        catch(error){console.error("Erreur_recup_emprunt:",error)}
    }

    //on l'appelle qu'une seule fois au chargement
    useEffect(() => {
        recup_emprunt()
    }, [])

   function add(materiel : Emprunt_mat_inventaire,prev : Emprunt_mat_inventaire[], i : number) : Emprunt_mat_inventaire[]{
        if(materiel.quantite === 0 && i === -1){ return prev}
        else{
            let exist = prev.find((elt) => elt.inventaire.description=== materiel.inventaire.description);
            let new_mat : Emprunt_mat_inventaire = {inventaire : materiel.inventaire, quantite : 0, id: materiel.id};
            if(exist === undefined){
                new_mat.quantite = 1
            }
            else{new_mat.quantite = exist.quantite + i}
            let buff = prev.filter((elt) => elt.inventaire.id !== materiel.inventaire.id);
            return [new_mat,...buff]
        }
    }

    function rendre(materiel: Emprunt_mat_inventaire) {
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
        let ticket = {type : "Rendu", date : get_info().date, userId : get_info().userId, materiels : rendu.materiels}
        const response = await fetch("/api/ticket",{
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ticket}),
        })
        const data = await response.json()
        console.log(data)
    }

    return (
    <div>

    <nav>
        <Link href="/log">Emprunter</Link>
        <Link href="/">Déconnexion</Link>
        <Link href="/admin">Admin</Link>
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
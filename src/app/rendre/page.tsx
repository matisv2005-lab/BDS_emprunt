"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Materiel = { 
  nom: string
  qt: number
  info : string
}

export default function rendu_emp() {
    const [data_bdd, setData] = useState<Materiel[]>([])
    const[rendu,setRendu] = useState<Materiel[]>([])

    function recup_histo(){
        //TODO : récupère les infos de BDD_users et met dans data le matériel emprunté par le users
         const fakeData = [
        { nom: "Ballon", qt: 3, info : ""},
        { nom: "Raquette", qt: 5, info : "Raquette erraflée"},
        ]
        setData(fakeData)
    }

    //on l'appelle qu'une seule fois au chargement
    useEffect(() => {
        recup_histo()
    }, [])

   function add(materiel : Materiel,prev : Materiel[], i : number){
        if(materiel.qt === 0 && i === -1){
            return prev
        }
        else{
            let exist = prev.find((elt) => elt.nom === materiel.nom);
            let new_mat = {nom:"typage", qt : 0, info :""};
            if(exist === undefined){
                new_mat = {...materiel, qt : 1}
            }
            else{
                new_mat = {...materiel, qt : exist.qt + i}
            }
            let buff = prev.filter((elt) => elt.nom !== materiel.nom);
            return [new_mat,...buff]
        }
    }

    function rendre(materiel : Materiel){
        // enlève le matériel de data_bdd
        setData((prev) => { return add(materiel,prev,-1) })
        // ajoute dans la liste du panier
        if(materiel.qt > 0){
            setRendu((prev) => { return add(materiel,prev,1) } )
        }
    }

    function annuler(materiel : Materiel) {
        if(materiel.qt > 0){
            setData((prev) => { return add(materiel,prev,1)})
            if(materiel.qt === 1){ setRendu((prev) => [...prev.filter((elt) => elt.nom !== materiel.nom)]) }
            else{ setRendu((prev) => { return add(materiel,prev,-1)}) }
        }
    } 
    
    function rendre_vrm(){
        // TODO: logique rendu : envoie une requete en attente d'être validée par un admin avec un message
        console.log(rendu)
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
                    <th>Rendre</th><th>Matériel</th><th>Quantité</th><th>Message</th>
                </tr>
            </thead>
            <tbody id="materiel-body">
                {data_bdd.map((elt, i) => (
                    <tr key={i}>
                    <td>
                        <button  type="button" onClick={() => rendre(elt)}>+</button>
                    </td>
                    <td>{elt.nom}</td>
                    <td>{elt.qt}</td>
                    <td>{elt.info}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        <label htmlFor="materiel-table">Matériel prêt à être rendu :</label>

        <br/>

        <table border={1} id="materiel-table">
            <thead id="materiel-header">
                <tr>
                    <th>Annuler</th><th>Matériel</th><th>Quantité</th><th>Message</th>
                </tr>
            </thead>
            <tbody id="materiel-body">
                {rendu.map((elt, i) => (
                    <tr key={i}>
                    <td>
                        <button  type="button" onClick={() => annuler(elt)}>-</button>
                    </td>
                    <td>{elt.nom}</td>
                    <td>{elt.qt}</td>
                    <td>{elt.info}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <button type="button" onClick={() => rendre_vrm()}>Rendre</button>
    </form>

    </div>
  )
}
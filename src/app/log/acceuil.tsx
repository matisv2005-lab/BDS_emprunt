"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Materiel = {
  nom: string
  qt: number
  info : string
}

export default function accueil_emp() {
    // UseState conserve des données d’un rendu à l’autre et 
    // Déclenche un rendu React du composant avec ces nouvelles données
    const [sport, setSport] = useState("Tennis")
    const [data_bdd, setData] = useState<Materiel[]>([])
    const[panier,setPanier] = useState<Materiel[]>([])
    

    // Récupère les infos de la BDD du matériel dispo pour le sport du select
    async function recup_bdd(sport: string) {
        // TODO: remplacer par appel API
        const fakeData = [
        { nom: "Ballon", qt: 3, info :""},
        { nom: "Raquette", qt: 5, info :"fée-belek"},
        ]
        setData(fakeData)
    }

    // update quand sport change
    useEffect(() => {
        recup_bdd(sport)
    }, [sport])

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

    function emprunter(materiel : Materiel){
        // enlève le matériel de data_bdd
        setData((prev) => { return add(materiel,prev,-1) })
        // ajoute dans la liste du panier
        if(materiel.qt > 0){
            setPanier((prev) => { return add(materiel,prev,1) } )
        }
    }

    function annuler(materiel : Materiel) {
        if(materiel.qt > 0){
            setData((prev) => { return add(materiel,prev,1)})
            if(materiel.qt === 1){ setPanier((prev) => [...prev.filter((elt) => elt.nom !== materiel.nom)]) }
            else{ setPanier((prev) => { return add(materiel,prev,-1)}) }
        }
    }

    function valider_vrm(){
        // TODO: logique panier : ajouter au panier puis faire en sorte qu'on puisse valider le panier et donc envoyer requete à
        // BDD_mat : pour enlever dispo et ajouter à BDD_user le mat emprunter
        console.log(panier)
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
                        <button onClick={() => emprunter(elt)}>+</button>
                    </td>
                    <td>{elt.nom}</td>
                    <td>{elt.qt}</td>
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
                {panier.map((elt, i) => (
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
        <button type="button" onClick={() => valider_vrm()}>Emprunter</button>

    </div>

    </div>
  )
}
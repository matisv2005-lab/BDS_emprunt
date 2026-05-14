"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

//Type est soit "Emprunt" soit "Rendu"
type Ticket = {
    type : string
    nom: string
    qt: number
    info : string
    date : string
    user : string
}

export default function admin() {

    const[data_tickets, setData] = useState<Ticket[]>([])
    const[table, setTable] = useState("Users")
    // const[BDD,setBDD] = useState<Materiel[]>([])

    function recup_tickets(){
        //TODO : récupère les tickets de BDD_tickets et met dans data le matériel emprunté par le users
         const fakeData = [
        { type : "Emprunt", nom: "Ballon", qt: 3, info : "", date : "2023-10-01", user : "Utilisateur1"},
        { type : "Rendu", nom: "Raquette", qt: 5, info : "Raquette erraflée", date : "2023-10-02", user : "Utilisateur2"},
        ]
        setData(fakeData)
    }

    //on l'appelle qu'une seule fois au chargement
    useEffect(() => {
        recup_tickets()
    }, [])

    function valider(ticket : Ticket){
        //Supprimer le ticket de la BDD_tickets
    }

    function add_bdd(){

    }
    function supp_bdd(){

    }
    function maj_bdd(){
        
    }

    function afficher_select(table : string){
         if(table === "Users"){
            return(
                //Section à revoir : pas sûr de l'architecture de la table Users
                <div>
                <p>Caractéristiques de l'utilisateur:</p>
                <input type="text" placeholder="Nom du matériel"/>
                <input type="text" placeholder="Quantité"/>
                <input type="text" placeholder="Informations supplémentaires"/>
                <input type="text" placeholder="Date"/>
                <input type="text" placeholder="Utilisateur"/>
                </div>
        )} 
        else if(table === "Tickets"){
            return(
                <div>
                <p>Caractéristiques du Ticket:</p>
                <input type="text" placeholder="Type"/>
                <input type="text" placeholder="Nom du matériel"/>
                <input type="text" placeholder="Quantité"/>
                <input type="text" placeholder="Informations supplémentaires"/>
                <input type="text" placeholder="Date"/>
                <input type="text" placeholder="Utilisateur"/>
                </div>
        )}
        else if(table === "Inventaire"){
            return(
                <div>
                <p>Caractéristiques du matériel:</p>
                <input type="text" placeholder="Nom du matériel..."/>
                <input type="text" placeholder="Quantité..."/>
                <input type="text" placeholder="Informations supplémentaires..."/>
                </div>
        )}
    }

    return (
        <div>

        <nav>
            <Link href="/log">Espace Cotisant</Link>
            <Link href="/">Déconnexion</Link>
        </nav>
        <h1>Page emprunt ADMIN BDS</h1>
        <h2>Fée du Sport</h2>

        <div>
            <h3>Demandes</h3>

            <label htmlFor="table-ticket">Tickets</label>

            <br/>
            <input type="text" id="search-bar" placeholder="Rechercher un ticket..."/>
            <br/>

            <table border={1} id="table-ticket">
                <thead id="ticket-header">
                    <tr>
                        <th>Valider</th><th>Type de demande</th><th>Matériel</th><th>Quantité</th><th>Date</th><th>Utilisateur</th><th>Info</th>
                    </tr>
                </thead>
                <tbody id="ticket-body">
                    {data_tickets.map((elt, i) => (
                        <tr key={i}>
                            <td><button  type="button" onClick={() => valider(elt)}>Check</button></td>
                            <td>{elt.type}</td>
                            <td>{elt.nom}</td>
                            <td>{elt.qt}</td>
                            <td>{elt.date}</td>
                            <td>{elt.user}</td>
                            <td>{elt.info}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
                       
            <h3>Edition manuelle de la BDD</h3>
            <label htmlFor="table-select">Choisir une table à modifier :  </label>
            <select
                id="table-select"
                value={table}
                onChange={(e) => setTable(e.target.value)}
            >
                <option value="Users">Utilisateurs Cotisants</option>
                <option value="Tickets">Tickets</option>
                <option value="Inventaire">Inventaire Disponible</option>
            </select>
            
           <div>{afficher_select(table)}</div>

            <button  type="button" onClick={() => add_bdd()}>Ajouter un matériel</button>
            <button  type="button" onClick={() => supp_bdd()}>Supprimer une entrée</button>
            <button  type="button" onClick={() => maj_bdd()}>Mettre à jour une entrée</button>

        </div>
        </div>
    );
}

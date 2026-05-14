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
    userId : string
}

export default function admin() {

    const[data_tickets, setData] = useState<Ticket[]>([])
    const[table, setTable] = useState("Users")

    const[nom, setNom] = useState("")
    const[prenom, setPrenom] = useState("")
    const[email, setEmail] = useState("")

    const[description, setDescription] = useState("")
    const[info, setInfo] = useState("")
    const[quant, setQuant] = useState(0)

    const[type, setType] = useState("")
    const[date, setDate] = useState("")
    const [userId, setUserId] = useState("");
    
    const [inventaireId, setInventaireId] = useState("");

    function recup_tickets(){
        //TODO : récupère les tickets de BDD_tickets et met dans data le matériel emprunté par le users
         const fakeData = [
        { type : "Emprunt", nom: "Ballon", qt: 3, info : "", date : "2023-10-01", userId : "12"},
        { type : "Rendu", nom: "Raquette", qt: 5, info : "Raquette erraflée", date : "2023-10-02", userId : "23"},
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

    async function add_bdd(){
        let contenu = {}
        if(table == "Users"){ contenu = {table : table, nom: nom, prenom: prenom, email: email} }
        else if(table == "Tickets"){ contenu = {table : table, type: type, description: description, quantite: quant, info: info, date: date, userId: userId} }
        else if(table == "Inventaire"){ contenu = {table : table, description: description, quantite: quant, info: info} }
        else if(table == "Emprunt"){ contenu = {table : table, userId: userId, inventaireId: inventaireId, quantite: quant, date: date} }
        const response = await fetch("/api/inventaire",{
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({
            description: description,
            quantite: quant,
            info: info,
        }),
    })

    const data = await response.json()

    console.log(data)
    }
    function supp_bdd(){

    }
    function maj_bdd(){
        
    }

    //pour l'architecture de la BDD voir schema.prisma
    function afficher_select(table : string){
         if(table === "Users"){
            return(
                <div>
                <p>Caractéristiques de l'utilisateur:</p>
                <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom du cotisant"/>
                <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prenom du cotisant"/>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                </div>
        )} 
        else if(table === "Tickets"){
            return(
                <div>
                <p>Caractéristiques du Ticket:</p>
                <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type"/>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}  placeholder="Nom du matériel"/>
                <input type="text" value={quant} onChange={(e) => setQuant(Number(e.target.value))} placeholder="Quantité"/>
                <input type="text" value={info} onChange={(e) => setInfo(e.target.value)}  placeholder="Informations supplémentaires"/>
                <input type="text" value={date} onChange={(e) => setDate(e.target.value)}  placeholder="Date"/>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="ID de l'utilisateur"/>
                </div>
        )}
        else if(table === "Inventaire"){
            return(
                <div>
                <p>Caractéristiques du matériel:</p>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Nom du matériel..."/>
                <input type="text" value={quant} onChange={(e) => setQuant(Number(e.target.value))} placeholder="Quantité"/>
                <input type="text" value={info} onChange={(e) => setInfo(e.target.value)} placeholder="Informations supplémentaires..."/>
                </div>
        )}
        else if (table === "Emprunt") {
        return (
            <div>
                <p>Caractéristiques de l'emprunt :</p>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="ID utilisateur..."/>
                <input type="text" value={inventaireId} onChange={(e) => setInventaireId(e.target.value)} placeholder="ID inventaire..."/>
                <input type="number" value={quant} onChange={(e) => setQuant(Number(e.target.value))} placeholder="Quantité"/>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
            </div>
        );
    }
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
                            <td>{elt.userId}</td>
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
                <option value="Emprunt">Emprunts en cours</option>
            </select>
            
           <div>{afficher_select(table)}</div>

            <button  type="button" onClick={() => add_bdd()}>Ajouter une entrée</button>
            <button  type="button" onClick={() => supp_bdd()}>Supprimer une entrée</button>
            <button  type="button" onClick={() => maj_bdd()}>Mettre à jour une entrée</button>

        </div>
        </div>
    );
}

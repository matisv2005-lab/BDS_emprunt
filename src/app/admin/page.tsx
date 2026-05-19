"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import type { Ticket } from "@/type/type"

export default function Admin() {

    const[data_tickets, setData] = useState<Ticket[]>([])
    const[table, setTable] = useState("utilisateur")

    const[nom, setNom] = useState("")
    const[prenom, setPrenom] = useState("")
    const[email, setEmail] = useState("")
    const[rezelId, setRezelId] = useState("")
    const[role, setRole] = useState("USER")

    const[description, setDescription] = useState("")
    const[info, setInfo] = useState("")
    const[quant, setQuant] = useState(0)

    const[type, setType] = useState("")
    const[date, setDate] = useState("")
    const [userId, setUserId] = useState("");
    
    const [inventaireId, setInventaireId] = useState("");

    //on l'appelle qu'une seule fois au chargement
    useEffect(() => {
        let cancelled = false

        async function recup_tickets(){
            //Récupère les tickets de BDD_tickets
            try{
                const response = await fetch("/api/ticket")
                const data = await response.json()
                if (!cancelled) setData(data)
            } 
            catch(error){console.error("Erreur_recup_tickets:",error)}
        }

        recup_tickets()

        return () => {
            cancelled = true
        }
    }, [])

    function valider(ticket : Ticket){
        //Supprimer le ticket de la BDD_tickets
        requete_bdd("DELETE", ticket,"ticket")
        //si c'est un emprunt : on ajoute le mat à la BDD_emprunt
         if(ticket.type === "Emprunt"){
            const emprunt = {date : ticket.date, userId : ticket.userId, materiels : ticket.materiels}
            requete_bdd("POST", emprunt, "emprunt")
            //et on enlève le mat de la BDD_inventaire en mettant -mat.quantite
            for(const mat of ticket.materiels){
                const inv = {id: mat.inventaire.id, description : mat.inventaire.description, stock : - mat.quantite, info : mat.inventaire.info}
                requete_bdd("PUT", inv, "inventaire")
            }
        }
        else if(ticket.type === "Rendu"){
            //si c'est un rendu : on supprime le mat de la BDD_emprunt et on ajoute le mat à la BDD_inventaire
            const emprunt = {date : ticket.date, userId : ticket.userId, materiels : ticket.materiels}
            requete_bdd("DELETE", emprunt, "emprunt")
            for(const mat of ticket.materiels){
                const inv = {id: mat.inventaire.id, description : mat.inventaire.description, stock : mat.quantite, info : mat.inventaire.info}
                requete_bdd("PUT", inv, "inventaire")
            }
        }
    }

    function get_contenu(table : string){
        let contenu = {}
        if(table == "utilisateur"){ contenu = {id: userId, rezelId: rezelId, nom: nom, prenom: prenom, email: email, role: role} }
        else if(table == "ticket"){ contenu = {type: type, description: description, quantite: quant, info: info, date: date, userId: userId} }
        else if(table == "inventaire"){ contenu = {description: description, stock: quant, info: info} }
        else if(table == "emprunt"){ contenu = {userId: userId, inventaireId: inventaireId, quantite: quant, date: date} }
        return contenu;
    }

    async function requete_bdd(method : string, contenu_opt? : unknown, table_opt? : string){
        let contenu = {}
        let req_table = table
        //Pour faire des requetes personnalisés en dehors du select
        if(contenu_opt){
            contenu = contenu_opt
            if(table_opt){ req_table = table_opt }
        }
        else{ contenu = get_contenu(table) }
        const response = await fetch("/api/" + req_table,{
        method: method,
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify(contenu),
        })
        const data = await response.json()
        console.log(data)
    }

    //pour l'architecture de la BDD voir schema.prisma
    function afficher_select(table : string){
         if(table === "utilisateur"){
            return(
                <div>
                <p>Caractéristiques de l&apos;utilisateur:</p>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="ID utilisateur existant"/>
                <input type="text" value={rezelId} onChange={(e) => setRezelId(e.target.value)} placeholder="ID Rezel"/>
                <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom du cotisant"/>
                <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prenom du cotisant"/>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="USER">Cotisant</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                </select>
                </div>
        )} 
        else if(table === "ticket"){
            return(
                <div>
                <p>Caractéristiques du Ticket:</p>
                <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type"/>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}  placeholder="Nom du matériel"/>
                <input type="text" value={quant} onChange={(e) => setQuant(Number(e.target.value))} placeholder="Quantité"/>
                <input type="text" value={info} onChange={(e) => setInfo(e.target.value)}  placeholder="Informations supplémentaires"/>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}  placeholder="Date"/>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="ID de l'utilisateur"/>
                </div>
        )}
        else if(table === "inventaire"){
            return(
                <div>
                <p>Caractéristiques du matériel:</p>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Nom du matériel..."/>
                <input type="text" value={quant} onChange={(e) => setQuant(Number(e.target.value))} placeholder="Quantité"/>
                <input type="text" value={info} onChange={(e) => setInfo(e.target.value)} placeholder="Informations supplémentaires..."/>
                </div>
        )}
        else if (table === "emprunt") {
        return (
            <div>
                <p>Caractéristiques de l&apos;emprunt :</p>
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
            <button type="button" onClick={() => signOut({ callbackUrl: "/" })}>Déconnexion</button>
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
                    {data_tickets.map((elt) => (
                        <tr key={elt.id ?? `${elt.type}-${elt.date}`}>
                            <td><button  type="button" onClick={() => valider(elt)}>Check</button></td>
                            <td>{elt.id}</td>
                            <td>{elt.type}</td>
                            <td>{elt.date}</td>
                            <td>{elt.message}</td>
                            <td>{elt.userId}</td>
                            <td>
                                <ul>
                                    {elt.materiels.map((m) => (
                                    <li key={m.id}>
                                        {m.inventaire.description} x {m.quantite}
                                    </li>
                                    ))}
                                </ul>
                            </td>
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
                <option value="utilisateur">Utilisateurs Cotisants</option>
                <option value="ticket">Tickets</option>
                <option value="inventaire">Inventaire Disponible</option>
                <option value="emprunt">Emprunts en cours</option>
            </select>
            
           <div>{afficher_select(table)}</div>

            <button  type="button" onClick={() => requete_bdd("POST")}>Ajouter une entrée</button>
            <button  type="button" onClick={() => requete_bdd("DELETE")}>Supprimer une entrée</button>
            <button  type="button" onClick={() => requete_bdd("PUT")}>Mettre à jour une entrée</button>

            <p>NB : pour l&apos;update de la table Inventaire : le stock est maj en ajoutant la nouvelle valeur au stock existant</p>
        </div>
        </div>
    );
}

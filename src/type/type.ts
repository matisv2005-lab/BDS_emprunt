// src/types/ticket.ts

export type TypeTicket = "Emprunt" | "Rendu"
export type Role = "USER" | "ADMIN" | "SUPER_ADMIN"

export type Inventaire = {
  id?: string | null
  description: string
  stock: number
  info?: string | null
}

export type Ticket = {
  id?: string | null
  type: TypeTicket
  date: string
  message?: string | null
  userId?: string | null

  materiels: Ticket_mat_inventaire[]
}

export type Ticket_mat = {
  id?: string | null
  quantite: number
  ticketId?: string | null
  inventaireId?: string | null
}

export type Ticket_mat_inventaire = {
  id?: string | null
  quantite: number
  inventaire: Inventaire
}

export type Emprunt = {
  id?: string | null
  date: string
  userId?: string|null

  materiels: Emprunt_mat_inventaire[]
}

export type Emprunt_mat = {
  id?: string | null
  empruntId?: string|null
  inventaireId?: string |null
  quantite: number
}

export type Emprunt_mat_inventaire = {
  id?: string | null
  quantite: number
  inventaire: Inventaire
}

export type Utilisateur = {
  id?: string | null
  rezelId?: string | null
  nom: string
  prenom: string
  email: string
  role?: Role

  tickets?: Ticket[]
  emprunts?: Emprunt[]
}

# Site d'emprunt BDS : Fée du Sport

Application Next.js de gestion d'emprunt de matériel BDS avec authentification Rezel Connect et rôles applicatifs.

## Fonctionnalités / Cahier des charges

- Connexion Rezel Connect via Auth.js / NextAuth.
- Création automatique du cotisant en base à la première connexion.
- Rôles `USER`, `ADMIN`, `SUPER_ADMIN`.
- Pages `/log` et `/rendre` réservées aux utilisateurs connectés.
- Page `/admin` réservée aux admins.
- Routes API protégées côté serveur, sans faire confiance au `userId` envoyé par le navigateur.
- Seed du premier `SUPER_ADMIN`.
- Base de données avec quatres principales tables : Utilisateur / Emprunt / Ticket / Inventaire
- Système de panier pour le cotisant lors de l'emprunt et du rendu

## Fonctionnement attendu

- 1 / Le cotisant se log au site avec Rezel et aboutit à une page qui affiche l'inventaire
- 2 / Sur cette page il peut constituer un panier et valider une demande d'emprunt
- 3 / Afin d'éviter une gestion des stocks problématique, la demande d'emprunt génère un ticket qu'un admin qui gère le site
doit valider manuellement lors de l'emprunt physique du matériel avec la personne qui a fait la demande (cela évite de sg du matériel qui ne sera pas finalement emprunter)
- 4 / De même lors du rendu, le cotisant génère un ticket de rendu du matériel emprunté de son choix et un admin doit valider son ticket pour attester qu'il a bien rendu le matériel
- NB / Sur la page admin, tout admin peut modifier à sa guise la BDD, évidemment un admin peut casser la BDD mais on suppose qu'ils sont responsables... Ils peuvent aussi utiliser cette page pour maj l'inventaire et ajouter de nouveaux objets


## Configuration

Copier `.env.example` vers `.env` puis renseigner :

```bash
DATABASE_URL=postgresql://bds:bds@localhost:5432/bds_emprunt
AUTH_SECRET=...
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
REZEL_CLIENT_ID=...
REZEL_CLIENT_SECRET=...
REZEL_ISSUER_URL=https://auth.garezeldap.rezel.net/application/o/bds-emprunt/
```

Le callback à déclarer dans l'application Rezel est :

```text
http://localhost:3000/api/auth/callback/rezel
```

En production, remplacer `http://localhost:3000` par le domaine public.

## Installation

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Pour créer le premier super-admin, renseigner aussi :

```bash
SEED_SUPER_ADMIN_EMAIL=
SEED_SUPER_ADMIN_REZEL_ID=
SEED_SUPER_ADMIN_NOM=
SEED_SUPER_ADMIN_PRENOM=
```

## Limites

- La validation métier des stocks reste simple et doit encore être durcie pour empêcher les quantités négatives ou les validations concurrentes.
- Les écrans admin conservent l'interface initiale, volontairement minimale.
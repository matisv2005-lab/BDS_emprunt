# BDS Emprunt

Application Next.js de gestion d'emprunt de matériel BDS avec authentification Rezel Connect et rôles applicatifs.

## Fonctionnalités

- Connexion Rezel Connect via Auth.js / NextAuth.
- Création automatique du cotisant en base à la première connexion.
- Rôles `USER`, `ADMIN`, `SUPER_ADMIN`.
- Pages `/log` et `/rendre` réservées aux utilisateurs connectés.
- Page `/admin` réservée aux admins.
- Routes API protégées côté serveur, sans faire confiance au `userId` envoyé par le navigateur.
- Seed du premier `SUPER_ADMIN`.

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

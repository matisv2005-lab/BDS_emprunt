# Site d'emprunt BDS : Fée du Sport

## Cahier des charges

- Connexion avec Rezel pour entrer dans le site
- Système de rôle et de gestion de privilèges pour l'accès à la page admin
- Base de données avec trois principales tables : Utilisateur / Emprunt / Ticket / Inventaire
- Système de panier pour le cotisant lors de l'emprunt et du rendu

## Fonctionnement attendu

- 1 / Le cotisant se log au site avec Rezel et aboutit à une page qui affiche l'inventaire
- 2 / Sur cette page il peut constituer un panier et valider une demande d'emprunt
- 3 / Afin d'éviter une gestion des stocks problématique, la demande d'emprunt génère un ticket qu'un admin qui gère le site
doit valider manuellement lors de l'emprunt physique du matériel avec la personne qui a fait la demande (cela évite de sg du matériel qui ne sera pas finalement emprunter)
- 4 / De même lors du rendu, le cotisant génère un ticket de rendu du matériel emprunté de son choix et un admin doit valider son ticket pour attester qu'il a bien rendu le matériel
- NB / Sur la page admin, tout admin peut modifier à sa guise la BDD, évidemment un admin peut casser la BDD mais on suppose qu'ils sont responsables... Ils peuvent aussi utiliser cette page pour maj l'inventaire et ajouter de nouveaux objets

## Limites

## Problèmes
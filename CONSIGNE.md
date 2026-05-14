# Objectif : Proposez un système d’emprunt de matériel pour les cotisants du BDS.

## Consignes :
- priorité : backend solide / le visuel est secondaire.
- une authentification rezel
- une page d’accueil/connexion très simple
- L’utilisateur est soit un administrateur (respo local, bureau), soit un cotisant (un utilisateur de base
est forcément cotisant pour simplifier). 
- proposez votre propre système permettant aux cotisants d’emprunter du matériel au BDS, mais aussi aux responsables
des assos.
- rédiger un readme (à la racine du depo git) dans lequel vous présentez votre
solution, ses limites et les problèmes que vous avez rencontrés pendant le développement de
votre solution. Ainsi que votre cahier des charges.

## Cahier des charges :
- Implémentation de la connexion Rezel pour l’espace étudiant.
- Gestion des permissions sur la BDD.
- Un espace administrateur.
- Un espace cotisant pour emprunter.

## Aspects techniques :
- le site du BDS utilise un serveur NextJS. Vous devrez donc faire de même.
- Pareil pour la base de données, vous devrez utiliser PrismaDB.
Vous devez constamment tenir votre projet à jour sur votre depo git.

## Critères de notation et attendus:
- (1.6 pts) Respect du cahier des charges
- (2.4 pts) Qualité du code et documentation
- (0.8 pts) Tenue du depo git
- (2.4 pts) Projet fonctionnel
- (0.8 pts) Sécurité du projet

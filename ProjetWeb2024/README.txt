# Projet PorgWeb 2024

# Jeu de Hex

# Membres:
Kabouri Ouzennou Jaouad/ Akli Ramy


## Description

Le jeu se joue sur un tableau de 11x11 hexagones. Chaque joueur doit colorier (à son tour) les hexagones pour essayer de connecter deux bords opposés du damier.
Les notifications affichent qui est en train de jouer et si un joueur a déjà joué sur un hexagone.

### Fonctionnalités ajoutées :

- **Rejoindre une partie** en entrant un nom de joueur. (max 2 joueurs par partie, sans compter les spectateurs)

- **quitter une partie** en cliquant sur le boutton quitter, le joueur est automatquement enlevé de la liste (côté serveur, et la partie ne peut plus être continuée.)

- **Selectionner un hexagone** à colorier lorsque c'est votre tour, pas possible de selectionner un hexagone dejà selectionné (sinon c'est pas le jeu de Hex!).

- **Messagerie** qui indique le nom du joueur ayant envoyé le message et le message, ou spectateur 1,2,3 etc.

- **Notifications** pour indiquer si c'est votre tour ou si ce n'est pas le bon moment pour jouer, ou si vous selectionnez un héxagone deja colorié.

- **Mode spectateur** qui permet de suivre le jeu sans y participer (peut écrire dans la messagerie pour communiquer avec les joueurs).

- **Historique des coups** permettant aux spectateurs de naviguer entre les étapes du jeu, la premiere fois en arrière ramène au tout début de la partie, mais après ça suis tour par tour dans l'historique.


# Remarques

La fonction de victoire n'a pas été implementée malheureusement, la seule manière d'arrêter une partie est qu'un joueur quitte.
Le damier n'a pas pu être affiché en forme de losange, comme le classique (plein d'erreurs).


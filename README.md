# GO

##Architecture MVC

Une classe Go initie le jeu :

``var Go = ( {M,V,C}, {params} )`
	
Ses arguments sont les classes M, V et C correspondant au type de partie que l'on souhaite créer. Ainsi que les paramètres du jeu (taille, difficulté, IA ou non)

Trois classes gèrent le MVC :

- GoModel
- GoController
- GoView

Go Model : enregistre et distribue l'état de jeu. Avertit la vue des changements.

Go Controller : GoControllerServer et GoControllerClient. Réagit à la vue, si un coup est joué alors vérifie la validité, voire demande au serveur, et met à jour le modèle si besoin. Peut prévenir la Vue d'erreurs.

Go View : lance les animations, met à jour ce que voit le joueur.


#By Axel

Server et client partagent différents fichiers de classes (mais pas Go_View_HTML pour le serveur par exemple)

 
MVC
- V est averti par M des changements (utile pour supprimerPierre, placerPierre et les animations)
- C informe des changements à M
- V appelle C pour faire les changements s'ils sont autorisés (vérif en C)

var Go = new Go(Go_Model_Standard,Go_Controller_Client,Go_View_HTML,35,35) on passe le MVC (les classes, pas les objets) et les informations de la partie de Go

Dans le constructeur de Go :
- on stocke dans les propriétés les propriétés du jeu (35x35) dans l'objet
- on crée les objets MVC en leur passant this (objet Go) pour qu'elles aient accès au MVC et à Go
- on stocke dans les propriétés les objets MVC
De GoView on accède à this.go.controller par exemple

Go
GoController (this.type = human ou ia) contient les algos de vérif
- GoController_Client
- GoController_Server
GoView (une interface)
- GoView_Debug (ascii pour le serv console log)
- GoView_HTML (client)

Pour placer une pierre :
- GoController_Client appelle la vérif du parent GoController puis envoie la fonction au serveur
- GoController_Server appelle la vérif du parent GoController

On place une pierre :
- La vue reçoit le listener du click
- Elle appelle this.go.controller.placerPion(34,32)
- this.go.controller.placerPion appelle l'algo parent pour vérif (si autorisé, la fonction parente update le model qui lui-même update la view), puis (dans l'enfant), envoie au serveur l'action effectuée, en asynchrone.  (Pas forcément return true ; si erreur on notifie la vue direct)
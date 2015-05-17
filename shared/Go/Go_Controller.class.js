//en bas, dictionnaire des fonctions
var Go_Controller = dejavu.Class.declare({
	$extends: Go_MvcComponent,
	// todo fonctions statiques?

	placeStone: function(x,y) {
		if (this.go.model.isEmpty(x,y)) //ask Model "Is this case empty ?"
		{
			

			// dans le modèle on place la pierre, ce qui permet de faire comme si elle était placée
			// quitte à l'enlever plus tard
			this.go.model.setStone(x, y); // @todo ne placer la stone que si elle doit vraiment être placée ?
			// récupérer depuis M les cases adjacentes
			// dans M, les cases sont des objets avec .state, .owner, .whatelse?
			// renvoie un tableau [N,E,S,W]
			
			//  si il y a au moins une liberté
			if ( this.chainHasLiberty(x,y,this.go.currentPlayer) ){
				//placerPierre dans M et dans V
				this.setStone(x,y);

				if ( this.captureIsPossible(x,y) ){

					// ou this.setStone?
					this.go.model.setStone(x, y);
					this.go.view.queue("setStone", {x, y});
					
					this.captureStonesAround(x, y);
				}
				
				this.returnNextPlayer();
			} else {
				//si les vosiisn sont des ennemis
				if ( this.neighboursAreEnnemies() ){
					//si une capture est possible
					if ( this.captureIsPossible() ) {
						if ( this.noKo ) {
							this.setStone(x,y);
							this.captureStonesAround(x, y);

							this.returnNextPlayer();

						} else {
							this.go.model.removeStone(x, y);
							this.returnError("ko");
						}

					} else {
						this.go.model.removeStone(x, y);
						this.returnError("no liberty");
					}
				} else {  // les voisins sont des amis
					this.setStone(x,y);
				}
			} //end if this.hasLiberty
			
			return true;
		}
		else
		{ //in cell aint empty
			this.go.view.error("La case est occupée.");
		}
	},
	/**
	 * chainHasLiberty
	 * Renvoie vrai si une chaîne passant par l'emplacement indiqué supposé appartenant au joueur player a une liberté (et donc s'il est possible selon les règles de placer la pierre ici)
	 * @todo ennemi ko ?
	 * @param  {[obj]}  neighbours object containing every neighbours of a cell
	 * @return {Boolean}   true : the cell has at least one liberty, false : no liberty
	 */
	chainHasLiberty : function(x, y, player){
		// c'est plus compliqué que ça.
		var neighbours = this.go.model.getNeighbours(x, y);
		neighbours.forEach(function(e){
			if (e.state == 0 ) {
				return true;
			}
		});
		return false;
	},

	/**
	 * captureStonesAround does everything in order to capture stones around a cell;
	 * @param {[int]} x x position of a cell on the goban
	 * @param {[int]} y y position of a cell on the goban
	 * @return {[type]}   [description]
	 */
	captureStonesAround : function(x, y){
		return true;
	},
	returnNextPlayer : function(){
		return true;
	},
	neighboursAreEnnemies : function(x, y){
		return true;
	},
	captureIsPossible : function(x, y){
		return true;
	},
	noKo : function(x, y){
		return true;
	},
	returnError : function(string){
		return string;
	},
  capturePossible : function (curr, prev){
	var prev = null || prev;
	if (hasLiberty(curr)) return false
	getNeighbours(curr).forEach(function (neighbour){
		//si la cellule voisine est occupée et que c'est l'inverse de nous
		if ( neighbour.state == 1 && neighbour.owner != go.currPlayer ) {
			if ( neighbour.coords != prev ) {
				return capturePossible(neighbour.coords, curr);
			} 
		}
	});
	return true;
	}





	
});


/*Input : F, 2, W
Neigh : F1Ø, mur, F3B, E2B
SI voisin noir _qui n est pas précédent(retry)
SINON SI Voisin Vide

curr : [x, y]
prev : [x, y]*/

function capturePossible(curr, prev){
	var prev = null || prev;
	if (hasLiberty(curr)) return false
	getNeighbours(curr).forEach(function (neighbour){
		//si la cellule voisine est occupée et que c'est l'inverse de nous
		if ( neighbour.state == 1 && neighbour.owner != go.currPlayer ) {
			if ( neighbour.coords != prev ) {
				return capturePossible(neighbour.coords, curr);
			} 
		}
	});
	return true;
}

			/*
				LISTE DES FONCTIONS  :
				[]this.go.model.getNeighbours(x, y)
					récupère les voisins 
				[ok]this.hasLiberty(x,y)
					regarde si une case a des libertés
				[ok]this.setStone(x, y)
					lance tout le nécessaire pour placer une pierre autorisée
				[w]this.captureStonesAround(x, y)
					capture les pierres autour d'une zone
				[w]this.returnNextPlayer()
					joueur suivant
				[w]this.neighboursAreEnnemies(x, y)
					répond par bool si les voisins d'une case sont des ennemis
				[w]this.captureIsPossible(x,y)
					à partir d'une position, décide si une capture est possible
				[]this.noKo
					vérifie que le coup ne provoquera pas de ko
				[]this.returnError(string)
					renvoie une erreur ( ko, no liberty, ou autre ?)
			 */
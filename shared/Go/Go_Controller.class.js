//en bas, dictionnaire des fonctions
var Go_Controller = dejavu.Class.declare({
	$extends: Go_MvcComponent,
	// todo fonctions statiques?

	placeStone: function(x,y) {
		//ask Model "Is this case empty ?"
		if ( this.go.model.getIntersection(x, y).isEmpty() ) 
		{
			// dans le modèle on place la pierre, ce qui permet de faire comme si elle était placée
			// quitte à l'enlever plus tard
		 // @todo ne placer la stone que si elle doit vraiment être placée ?
			
			console.log("coup joué en "+ x +" "+ y);
			//met la pierre dans le model, pour simuler sa présence
			this.go.model.placeStone(x, y);

			//#TODO : ATTENTION CETTE REGLE EST STUPIDE ET INCORRECTE
			//si au mileu de 4 enemis, rejeter la pierre
			// if ( this.neighboursAreEnemies(x,y,this.go.currentPlayer) ) {
			// 	this.go.model.removeStone(x, y);
			// 	return false;
			// }

			//  si il y a au moins une liberté...
			console.log( "liberté de la chaine " +this.chainHasLiberty(x,y,this.go.currentPlayer) );
			if ( this.chainHasLiberty(x,y,this.go.currentPlayer) ){
				
					// placer la pierre
					this.go.model.placeStone(x, y);
					// this.go.view.queue("setStone", {x, y});
					
					//voir si ça déclenche une capture
					if ( this.captureIsPossible(x, y) ){
						console.log("capture possible");
								
						this.captureStonesFrom(x, y);				
						//this.returnNextPlayer();	
					}
					
			} else {
				//si les voisins sont des ennemis
				if ( this.neighboursAreEnemies() ){
					//si une capture est possible
					if ( this.captureIsPossible() ) {
						if ( this.noKo ) {
							this.go.model.placeStone(x, y);
							this.captureStonesFrom(x, y);

							//this.returnNextPlayer();

						} else {
							this.go.model.removeStone(x, y);
							//this.returnError("ko");
							this.nextTurn();
						}

					} else {
						this.go.model.removeStone(x, y);
						this.returnError("no liberty");
					}
				} else {  // les voisins sont des amis
					this.go.model.placeStone(x, y);
				}
			} //end if this.hasLiberty

			this.nextTurn(x, y);
			return true;
		}
		//cell aint empty...
		else
		{ 
			return "La case est occupée.";
		}
	},
	/**
	 * chainHasLiberty
	 * Renvoie vrai si une chaîne passant par l'emplacement indiqué supposé 
	 * appartenant au joueur player a une liberté (et donc s'il est possible 
	 * selon les règles de placer la pierre ici)
	 * @todo ennemi ko ?
	 * @param  {[obj]}  neighbours object containing every neighbours of a cell
	 * @return {Boolean}   true : the cell has at least one liberty, false : no liberty
	 */
	chainHasLiberty: function(x, y, player){
		// c'est plus compliqué que ça.

		var visitedArr = [];

		/**
		 * intersectionVisited returns true if a cell has already been visited
		 * @param  {array} intersection  [x,y] coords of the cell to check
		 * @return {bool}    true : cell has been visited
		 */
		function intersectionVisited(intersection){
			for (var i = 0; i < visitedArr.length; i++){
				if ( intersection[0] === visitedArr[i][0] && intersection[1] === visitedArr[i][1] )
					return true
			}
			return false;
		}

		/**
		 * checkLiberties : each call evaluates liberties of a cell, 
		 * 	by recursivity it evaluates those of a chain
		 * @param  {array} cell [x,y] coords
		 * @return {bool}       true if a cell has a liberty (thus the whole chain has a liberty)
		 */
		function checkLiberties(x, y, player){
			var neighbours = this.go.model.getNeighboursCoords(x, y);
			//cherche un voisin libre
			console.log(neighbours);
					
			return neighbours.some(function(coords){
				var intersection = this.go.model.getIntersection(coords[0], coords[1]);
				console.log(intersection.isEmpty());
						
				if (intersection.isEmpty()) {  //si voisin est libre
					return true;
				} else if (intersection.getOwner() != player) {  //si voisin est pas de son camp
					visitedArr.push([intersection[0], intersection[1]]);
					return checkLiberties(intersection[0], intersection[1]);
				}					
			});
		}

		return checkLiberties(x, y, player);
	},

	getChainFromCoords: function(x, y, player){

		var chain = [];
		// c'est plus compliqué que ça.

		var visitedArr = [];

		/**
		 * intersectionVisited returns true if a cell has already been visited
		 * @param  {array} intersection  [x,y] coords of the cell to check
		 * @return {bool}    true : cell has been visited
		 */
		function intersectionVisited(intersection){
			for (var i = 0; i < visitedArr.length; i++){
				if ( intersection[0] === visitedArr[i][0] && intersection[1] === visitedArr[i][1] )
					return true
			}
			return false;
		}

		/**
		 * checkLiberties : each call evaluates liberties of a cell, 
		 * 	by recursivity it evaluates those of a chain
		 * @param  {array} cell [x,y] coords
		 * @return {bool}       true if a cell has a liberty (thus the whole chain has a liberty)
		 */
		function aggregateStones(x, y, player){
			var neighbours = this.go.model.getNeighboursCoords(x, y);
			//cherche un voisin allié à player
					
			neighbours.forEach(function(coords){
				var intersection = this.go.model.getIntersection(coords[0], coords[1]);
				console.log(intersection.isEmpty());
				
				if (intersection.getOwner() === player) {  //si voisin est pas de son camp
					chain.push([intersection[0], intersection[1]]);
					return aggregateStones(intersection[0], intersection[1]);
				}					
			});
			return chain;
		}


		return aggregateStones(x, y, player);
	},

	/**
	 * captureStonesFrom does everything in order to capture stones around a cell;
	 * @param {[int]} x x position of a cell on the goban
	 * @param {[int]} y y position of a cell on the goban
	 * @return {[type]}   [description]
	 */
	captureStonesFrom: function(x, y){
		console.log(" capture stones around : "+x+" "+y);

		//détecter la chaine grâce au model
		//rechercher la chaine en mémoire
		//supprimer chaque maillon
		
		//détecter la chaine dont fait partie la pierre incriminée via exploration
		var chain = getChainFromCoords(x, y, this.currentPlayer%2+1);

		//supprimer chaque pierre
		chain.forEach(function(stone){
			this.go.model.removeStone(stone[0], stone[1]);
		})


		return true;
	},
	returnNextPlayer: function(){
		return true;
	},
	/**
	 * if 4 enemies around intersection, returns true
	 * @param  {[type]} x      [description]
	 * @param  {[type]} y      [description]
	 * @param  {[type]} player [description]
	 * @return {[type]}        [description]
	 */
	neighboursAreEnemies: function(x, y, player){
		//getNeighbours
		var neighbours = this.go.model.getNeighbours(x, y);
		//crawlneighbours
		var enemies = 0;
		console.log(neighbours);
				
		neighbours.forEach(function(cell){
			if ( !cell.isEmpty() && cell.getOwner() != player ){
				enemies++;
			}
		});
		return enemies >= neighbours.length;
	},
	noKo: function(x, y){
		return true;
	},
	returnError: function(string){
		return string;
	},
	nextTurn: function(x, y){
		if (x) this.go.model.placeStone(x, y);
		this.go.view.render();
		this.go.changeCurrentPlayer();
		console.log("Joueur suivant ! : " + this.go.currentPlayer);
	},
	isEmpty: function(cell) {
		return cell.isEmpty();
	},
  captureIsPossible : function (x, y){
		// var prevX = prevX || -1;
		// if ( this.chainHasLiberty(currX, currY) ) 
		// 	return false
		// this.go.model.getNeighbours(curr).forEach(function (neighbour){
		// 	//si la cellule voisine est occupée et que c'est l'inverse de nous
		// 	if ( neighbour.state == 1 && neighbour.owner != go.currPlayer ) {
		// 		if ( neighbour.coords != prev ) {
		// 			return captureIsPossible(neighbour.coords, curr);
		// 		} 
		// 	}
		// });
		var neighbours = this.go.model.getNeighbours(x, y);
		return !this.chainHasLiberty(x, y);
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
				[w]this.captureStonesFrom(x, y)
					capture les pierres autour d'une zone
				[w]this.returnNextPlayer()
					joueur suivant
				[w]this.neighboursAreEnemies(x, y)
					répond par bool si les voisins d'une case sont des ennemis
				[w]this.captureIsPossible(x,y)
					à partir d'une position, décide si une capture est possible
				[]this.noKo
					vérifie que le coup ne provoquera pas de ko
				[]this.returnError(string)
					renvoie une erreur ( ko, no liberty, ou autre ?)
			 */
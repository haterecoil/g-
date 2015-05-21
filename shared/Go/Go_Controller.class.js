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

			//  si il y a au moins une liberté...
			//console.log( "liberté de la chaine " +this.chainHasLiberty(x,y,this.go.currentPlayer) );
			if ( this.chainHasLiberty(x,y,this.go.currentPlayer) ){
				
					// placer la pierre
					this.go.model.placeStone(x, y);
					// this.go.view.queue("setStone", {x, y});
							
					//voir si ça déclenche une capture
					this.tryCapture(x, y);
					this.nextPlayer(x, y);
					
					
			} else {
				//si les voisins sont des ennemis
				if ( this.neighboursAreEnemies(x, y, this.go.currentPlayer) ){
					//si une capture est possible
					if ( this.tryCapture(x, y) ){
						this.go.model.placeStone(x, y);
						this.nextPlayer(x, y);
					} else {
						this.go.model.removeStone(x, y);
						console.log("no liberty");
						//debugger;
						//this.returnError("no liberty");
					}
				} else {  // les voisins sont des amis
					this.go.model.placeStone(x, y);
				}
			} //end if this.hasLiberty

			//this.nextPlayer(x, y);
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
	 * @param  {x}  x int x pos of intersection
	 * @param  {y}  y int y pos of intersection
	 * @return {Boolean}   true : the cell has at least one liberty, false : no liberty
	 */
	chainHasLiberty: function(x, y){
		var visitedArr = [];
		var player = this.go.model.getIntersection(x,y).getOwner();
		if (player === undefined) console.log("chainHL: player undefined");
				
		/**
		 * intersectionVisited returns true if a cell has already been visited
		 * @param  {array} intersection  [x,y] coords of the cell to check
		 * @return {bool}    true : cell has been visited
		 */
		function intersectionVisited(intersectionCoords){
			for (var i = 0, len = visitedArr.length; i < len; i++){
				if ( intersectionCoords[0] === visitedArr[i][0] && intersectionCoords[1] === visitedArr[i][1] )
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
			console.log("checking liberties of "+ x +" "+y);
					
			return neighbours.some(function(coords){
				if ( !intersectionVisited(coords) ){
					visitedArr.push(coords);
					var intersection = this.go.model.getIntersection(coords[0], coords[1]);
					//console.log("checkLib : int is empty ? "+  intersection.isEmpty());
					if ( intersection === undefined) console.log("intersect undefined ! " + intersection);
									
					if (intersection.isEmpty()) {  //si voisin est libre
						return true;
					} else if (intersection.getOwner() == player) {  //si voisin est potentiellement suivable
						return checkLiberties(coords[0], coords[1], player);
					}						
				}
			});
		}
	
	var success = checkLiberties(x, y, player);
	console.log("has Liberty ? " + success);
			
		return success;
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
			console.log(player);
			chain.push([x,y]);
			neighbours.forEach(function(coords){
				var intersection = this.go.model.getIntersection(coords[0], coords[1]);
				if ( !intersectionVisited(intersection) ){
					console.log("owner of inter : " + intersection.getOwner());
					console.log("coords : " +coords[0]+" "+coords[1]);
					visitedArr.push(intersection);
							
					if ( intersection.getOwner() === player) {  
						console.log("found chain part :" +coords[0]+" "+coords[1] );
						chain.push([coords[0], coords[1]]);
						return aggregateStones(coords[0], coords[1], player);
					}			
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
		
		//détecter la chaine dont fait partie la pierre incriminée via exploration
		var chain = this.getChainFromCoords(x, y, this.go.currentPlayer%2+1);

		//console.log(this.go.currentPlayer);
				
		console.log(chain);
				
		//supprimer chaque pierre
		chain.forEach(function(stone){
			this.go.model.removeStone(stone[0], stone[1]);
		});

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
		var neighbours = this.go.model.getNeighbours(x, y);
		var enemies = 0;
		console.log("voisins : ");
			console.log(neighbours);
					
		console.log("joueur : " + parseInt(player));

		neighbours.forEach(function(cell){
			console.log(player);
					
			if ( !cell.isEmpty() && cell.getOwner() != player ){
				enemies++;
			}
		});
		console.log("neighbours are ennemies ? " + (enemies >= neighbours.length))
				
		return enemies >= neighbours.length;
	},
	noKo: function(x, y){
		return true;
	},
	nextPlayer: function(x, y){
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
	},

	/**
	 * tryCapture : detects capture scheme and act accordingly
	 * if capture is possible, and no ko, then capture and return true
	 * else return false
	 * @param  {[type]} x [description]
	 * @param  {[type]} y [description]
	 * @return {[type]}   [description]
	 */
	tryCapture: function(x, y) {

		//pour chaque voisin, tester si le voisin est ennemi et si 
		//la chaine dont il fait partie est capturable
		var neighbours = this.go.model.getNeighboursCoords(x, y);
		var success = false;
		var that = this;
		neighbours.forEach(function (intersection){			
		console.log("essai de capture par : " + this.go.currentPlayer);

			//if ennemy neighbour chain has no liberty
			if ( !that.chainHasLiberty(intersection[0], intersection[1], !this.go.currentPlayer) ) {
				console.log("capture chain from "+intersection[0]+" "+intersection[1]);
						
				that.captureStonesFrom(intersection[0], intersection[1]);
				console.log(this.go.currentPlayer+" capture inter " + intersection[0] + " " + intersection[1]);

				success = true;
			}
		});

		//si oui et que no ko alors capture
		return success;
	}





	
});


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
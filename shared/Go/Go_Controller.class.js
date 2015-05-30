//en bas, dictionnaire des fonctions
var Go_Controller = dejavu.Class.declare({
	$extends: Go_MvcComponent,
	pendingStone: null, // emplacement de la pierre que l'on tente de placer (utile pour les vérifications sur chaînes adjacentes, captures, etc.)
	
	// @todo fonctions statiques?

	placeStone: function(x,y) {
		console.log("##### Joueur : "+ this.go.currentPlayer + " #  " + x + " " + y);
				
		if ( this.go.model.getIntersection(x,y).isEmpty() ) 
		{
			this.pendingStone = [x, y];
			this.go.model.setPreviousGoban(); // "save" et "restore" ?
					
			// si il y a au moins une liberté...
			if ( this.chainHasLiberty(x,y,this.go.currentPlayer) ){
				
					// placer la pierre
					this.go.model.placeStone(x, y);
					
					// this.go.view.queue("setStone", {x, y}); pourquoi pas un système de queue, pour le render notamment
							
					//voir si ça déclenche une capture
					this.tryCapture(x, y, this.go.currentPlayer);

			} else {
				//si les voisins sont des ennemis
				if ( this.neighboursAreEnemiesOf(x, y, this.go.currentPlayer) ){ // @todo this.neighboursBelongTo ? @todo faire en sorte que le code ne dépende pas du joueur actuel et soit générique (player passé en argument, pas de concept d'ennemi) ?
					//si une capture est possible
					if ( this.tryCapture(x, y, this.go.currentPlayer) ){
								
						this.go.model.placeStone(x, y);
					} else { 
						// this.go.model.removeStone(x, y);
						console.log("no liberty");
						//debugger;
						//this.returnError("no liberty");
						return false;
					}
				}
			} //end if this.hasLiberty
			
			//everything is fine if you got there !
			if ( !this.go.model.currentGobanIsSameAsPrevious() ) {
				console.log("YES ! No ko <3 "); // @todo faudrait placeStone à cet endroit là...
				this.nextPlayer();
			} else {
				console.log("oops @ ko :x :x :x :x ");

				this.go.model.setPreviousGoban();
				return false;
			}

		}
		//cell aint empty...
		else
		{ 
			return "La case est occupée."; // @todo gestion des erreurs
		}

		console.log("check previous go ref, should be 2 : ");
		console.log(this.go.model.previousGoban[2][0].getOwner());
	},
	/**
	 * chainHasLiberty
	 * Renvoie vrai si une chaîne passant par l'emplacement indiqué supposé 
	 * appartenant au joueur player a une liberté (et donc s'il est possible 
	 * selon les règles de placer la pierre ici)
	 * @param  {x}  x int x pos of intersection
	 * @param  {y}  y int y pos of intersection
	 * @return {Boolean}   true : the cell has at least one liberty, false : no liberty
	 * @todo tryCapture appelle chainHasLiberty sur une cellule avec pierre placée alors que placeStone appelle chainHasLiberty sur une cellule avec pierre pas placée. il faut se mettre d'accord. pierre pas placée est dans visitedarr donc ça devrait le faire. en pratique ça fonctionne de toute façon quel que soit le cas, tellement notre code est bon.
	 */
	chainHasLiberty: function(x, y, player){
		var visitedArr = [];
		var pendingStone = this.pendingStone;
				console.log(pendingStone);
		console.log(x);
		console.log(y);
	
		/**
		 * intersectionVisited returns true if a cell has already been visited
		 * @param  {array} intersection  [x,y] coords of the cell to check
		 * @return {bool}    true : cell has been visited
		 */
		function intersectionVisited(intersectionCoords){
			for (var i = 0, len = visitedArr.length; i < len; i++){
				if (  intersectionCoords[0] === visitedArr[i][0] && intersectionCoords[1] === visitedArr[i][1]    
					||  (intersectionCoords[0] === pendingStone[0]  && intersectionCoords[1] === pendingStone[1]) ) { 
					return true;
				}
			} 
			return false;
		}

		/**
		 * checkLiberties : each call evaluates liberties of a cell, 
		 * 	by recursivity it evaluates those of a chain
		 * @param  {array} cell [x,y] coords
		 * @return {bool}       true if a cell has a liberty (thus the whole chain has a liberty)
		 */
		function recursivelyCheckIfChainHasLiberties(x, y, player){ // @todo axel n'a pas encore compris
			var coords = [x, y];
			visitedArr.push(coords);
			var neighbours = this.go.model.getNeighboursCoords(x, y);
			//cherche un voisin libre
			console.log("checking liberties of "+ x +" "+y);
					
			return neighbours.some(function(coords){ // la callback peut s'appeler aUneLiberté
				if ( !intersectionVisited(coords) ){
					
					var intersection = this.go.model.getIntersection(coords[0], coords[1]);
					//console.log("checkLib : int is empty ? "+  intersection.isEmpty());
					if ( typeof intersection === 'undefined'  )  {
						console.log("intersect undefined ! " + intersection); // @todo getIntersection return false si out of bounds?
					}
									
					if (intersection.isEmpty()) {  // si un élément quelconque de la chaîne a une liberté, on renvoie true
						return true;
					} else if (intersection.getOwner() == player) {  //si voisin est potentiellement suivable
						return recursivelyCheckIfChainHasLiberties(coords[0], coords[1], player);
					}	
				}
			});
		}
	
		var success = recursivelyCheckIfChainHasLiberties(x, y, player);
		console.log("has Liberty ? " + success);
			
		return success;
	},

	getChainFromCoords: function(x, y, player){ // @todo @axel je dois comprendre

		var chain = [];
		// c'est plus compliqué que ça.

		/**
		 * intersectionVisited returns true if a cell has already been visited
		 * @param  {array} intersection  [x,y] coords of the cell to check
		 * @return {bool}    true : cell has been visited
		 */
		function intersectionVisited(x, y){
			for (var i = 0; i < chain.length; i++){
				if ( x === chain[i][0] && y === chain[i][1] )
					return true;
			}
			return false;
		}

		function aggregateStones(x, y, player){

			console.log(" ###### AGGREGATE STONES ######");
							
			//chope les coords des voisins
			var neighbours = this.go.model.getNeighboursCoords(x, y);

			//ajoute la pierre initiale à la chaine
			chain.push([x,y]);

			neighbours.forEach(function(coords){
				//récupère l'intersection depuis des coordonnées
				var intersection = this.go.model.getIntersection(coords[0], coords[1]);
						
				//si l'intersection n'a pas été visitée
				if ( !intersectionVisited(coords[0], coords[1]) ){
					console.log("owner of inter : " + intersection.getOwner());
					console.log("coords : " +coords[0]+" "+coords[1]);
					//visitedArr.push(intersection);
							
					if ( intersection.getOwner() === player) {  
						console.log("found chain part :" +coords[0]+" "+coords[1] );
						//chain.push([coords[0], coords[1]]);
						return aggregateStones(coords[0], coords[1], player);
					}			
				}		
			});
			console.log(chain);
					
			return chain;
		}


		return aggregateStones(x, y, player);
	},

	/**
	 * captureChain does everything in order to capture stones around a cell;
	 * @param {[int]} x x position of a cell on the goban
	 * @param {[int]} y y position of a cell on the goban
	 * @return {[type]}   [description]
	 */
	captureChain: function(x, y, playerCapturing){
		console.log(" [call] getChainFC : "+x+" "+y+" pl:" + this.getOtherPlayer(playerCapturing));
		
		//détecter la chaine dont fait partie la pierre incriminée via exploration
		var chain = this.getChainFromCoords(x, y, this.getOtherPlayer(playerCapturing)); // @todo pourquoi parfois on passe "player" et parfois on récup direct via this.go(not)CurrentPlayer?
		
		// @todo est-ce que getChainfromCoords devrait pas plutôt renvoyer des intersections ? @morgan

		//console.log(this.go.currentPlayer);
				
		console.log(chain);
				
		//supprimer chaque pierre
		chain.forEach(function(coords){
			this.go.model.removeStone(coords[0], coords[1]);
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
	neighboursAreEnemiesOf: function(x, y, player){
		var neighbours = this.go.model.getNeighbours(x, y);
		var enemies = 0;
		console.log("voisins : ");
			console.log(neighbours);
					
		neighbours.forEach(function(cell){					
			if ( !cell.isEmpty() && cell.getOwner() != player ){
				enemies++;
			}
		});
		console.log("neighbours are ennemies ? " + (enemies >= neighbours.length));
				
		return enemies >= neighbours.length;
	},
	
	noKo: function(x, y){
		return true;
	},
	
	nextPlayer: function(){
		// if (x) this.go.model.placeStone(x, y); @todo @morgan t'as fait quoi
		this.go.changeCurrentPlayer();
		this.go.view.render(); // @todo on sait pas si on render toute la queue ou si le modèle render au fur et à mesure
		console.log("Joueur suivant ! : " + this.go.currentPlayer);
	},
	
	isEmpty: function(cell) {
		return cell.isEmpty();
	},

	getOtherPlayer: function(player) {
		return player%2+1;
	},

	/**
	 * tryCapture : detects capture scheme and act accordingly
	 * if capture is possible, and no ko, then capture and return true
	 * else return false
	 * @param  {[type]} x [description]
	 * @param  {[type]} y [description]
	 * @return {[type]}   [description]
	 */
	tryCapture: function(x, y, player) {

		var that = this;
		var success = false;
		console.log("## TryCapture, joueur "+player+" : " + x +" "+ y);
						
		function catchThemAll(x, y) {
			//pour chaque voisin, tester si le voisin est ennemi et si 
			//la chaine dont il fait partie est capturable
			var neighbours = this.go.model.getNeighboursCoords(x, y);	
			neighbours.forEach(function (coords){			
				// if ennemy neighbour chain has no liberty
				if ( !that.chainHasLiberty(coords[0], coords[1], that.getOtherPlayer(player)) ) { // @todo il faudrait pouvoir merge les tableaux de cellules visitées si les chaînes de deux neighbours se rencontrent (optimisation)
					console.log("[call] captureChain x"+coords[0]+" y"+coords[1] + " pl:" + player);

					that.captureChain(coords[0], coords[1], player);
					console.log(this.go.currentPlayer+" captured inter " + coords[0] + " " + coords[1]);

					success = true;
				}
			});	
		}
		
		//si oui et que no ko alors capture
		catchThemAll(x, y); 
		return success;// @todo @morgan à quoi sert ce return?
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
				[w]this.neighboursAreEnemiesOf(x, y)
					répond par bool si les voisins d'une case sont des ennemis
				[w]this.captureIsPossible(x,y)
					à partir d'une position, décide si une capture est possible
				[]this.noKo
					vérifie que le coup ne provoquera pas de ko
				[]this.returnError(string)
					renvoie une erreur ( ko, no liberty, ou autre ?)
			 */
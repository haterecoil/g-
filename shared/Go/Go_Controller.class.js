//en bas, dictionnaire des fonctions
/**
 * Base Go_Controller class. Is shared and extended 
 * by both client and server, mobile or desktop
 */
var Go_Controller = dejavu.Class.declare({
	$extends: Go_MvcComponent,
  shootingInterval: null,
	history: [],
    
	// @todo fonctions statiques?

	authorityPlaceStone: function(x,y, type) {
		this.go.model.placeStone(x, y, type);
		this.tryCapture(x, y, this.go.currentPlayer);
		this.playerHasPlayed(); // ou pas?
		this.history.push({nbPl: [null,this.go.model.countPlayer(1),this.go.model.countPlayer(2)], goban: 		this.go.model.getSerializedGoban()});
	},
	
	/**
	 * Go_Controller.playerCanPlay() asserts the player is authorized
	 * to play
	 * @return {bool} 
	 */
	playerCanPlay: function() {
		for (var x=0; x<this.go.size; x++)
		{
			for (var y=0; y<this.go.size; y++)
			{
				if (this.go.model.getIntersection(x,y).isEmpty())
				{
					this.go.model.placeStone(x, y, Go_Intersection.STONE_NORMAL);
					if (this.isKo() || !this.chainHasLiberty(x,y))
					{
						this.go.model.removeStone(x, y);
					}
					else
					{
						this.go.model.removeStone(x, y);
						return true;	
					}
				}
			}
		}
		return false;
	},
	
	/**
	 * Event triggered when a player tries to place a stone
	 * Place a stone, try to capture, verify ko's situation, and authorize 
	 * or not the play
	 * @param  {int} x    x position of stone
	 * @param  {int} y    y position of stone
	 * @param  {obj} type type of stone / turret
	 * @return {bool}
	 */
	placeStone: function(x,y,type) {
				
		console.log("##### Joueur : "+ this.go.currentPlayer + " #  " + x + " " + y);
				
		if ( this.go.model.getIntersection(x,y).isEmpty() ) 
		{
			//save game state
			this.go.model.gobanClone = this.go.model.getSerializedGobanWithHp();
			//place stone
			this.go.model.placeStone(x, y, type);

			// @todo ce ko est inutile ?
			// if (this.isKo())
			// {
			// 	// Ko before there 
			// 	this.go.model.restorePreviousGoban();
			// 	console.log('KO PRECAPTURE');
			// 	return false;
			// }
			
			this.tryCapture(x, y, this.go.currentPlayer);
			
			if (this.isKo())
			{
				this.go.model.restorePreviousGoban();
				console.log('KO POSTCAPTURE');
				return false;
			}
			else if ( !this.chainHasLiberty(x,y) )
			{
				this.go.model.restorePreviousGoban();
				console.log('NO LIBERTY POST');
				return false;
			}
			//everything is okay
			//trigger "hasPlayed" event, store the move
			else
			{
				this.playerHasPlayed();
				this.history.push({nbPl: [null,this.go.model.countPlayer(1),this.go.model.countPlayer(2)], goban: this.go.model.getSerializedGoban()});
				return true;
			}
		}
		else // if not empty
		{ 
			return "La case est occupée."; // @todo gestion des erreurs
		}

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
	chainHasLiberty: function(x, y){
		var visitedArr = [];

		/**
		 * intersectionVisited returns true if a cell has already been visited
		 * @param  {array} intersection  [x,y] coords of the cell to check
		 * @return {bool}    true : cell has been visited
		 */
		function intersectionVisited(intersectionCoords){
			for (var i = 0, len = visitedArr.length; i < len; i++){
				if (  intersectionCoords[0] === visitedArr[i][0] && intersectionCoords[1] === visitedArr[i][1]    
				   ) { 
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
		
		var that = this;
		
		function recursivelyCheckIfChainHasLiberties(x, y, player){ // @todo axel n'a pas encore compris
			var coords = [x, y];
			visitedArr.push(coords);
			var neighbours = that.go.model.getNeighboursCoords(x, y);
			//cherche un voisin libre
			//console.log("checking liberties of "+ x +" "+y);
					
			return neighbours.some(function(coords){ // la callback peut s'appeler aUneLiberté
				if ( !intersectionVisited(coords) ){
					
					var intersection = that.go.model.getIntersection(coords[0], coords[1]);
					//console.log("checkLib : int is empty ? "+  intersection.isEmpty());
					if ( typeof intersection === 'undefined'  )  {
						//console.log("intersect undefined ! " + intersection); // @todo getIntersection return false si out of bounds?
					}
									
					if (intersection.isEmpty()) {  // si un élément quelconque de la chaîne a une liberté, on renvoie true
						return true;
					} else if (intersection.getOwner() == player) {  //si voisin est potentiellement suivable
						return recursivelyCheckIfChainHasLiberties(coords[0], coords[1], player);
					}	
				}
			});
		}
	
		var player = this.go.model.getIntersection(x,y).getOwner();
		var success = recursivelyCheckIfChainHasLiberties(x, y, player);
			
		return success;
	},

	getChainFromCoords: function(x, y, player){ // @todo @axel je dois comprendre

		var chain = [];
		var that = this;
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
							
			//chope les coords des voisins
			var neighbours = that.go.model.getNeighboursCoords(x, y);

			//ajoute la pierre initiale à la chaine
			chain.push([x,y]);

			neighbours.forEach(function(coords){
				//récupère l'intersection depuis des coordonnées
				var intersection = that.go.model.getIntersection(coords[0], coords[1]);
						
				//si l'intersection n'a pas été visitée
				if ( !intersectionVisited(coords[0], coords[1]) ){
							
					if ( intersection.getOwner() === player) {  
						return aggregateStones(coords[0], coords[1], player);
					}			
				}		
			});
					
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
		
		//détecter la chaine dont fait partie la pierre incriminée via exploration
		var chain = this.getChainFromCoords(x, y, this.getOtherPlayer(playerCapturing)); // @todo pourquoi parfois on passe "player" et parfois on récup direct via this.go(not)CurrentPlayer?
		
		// @todo est-ce que getChainfromCoords devrait pas plutôt renvoyer des intersections ? @morgan
				
		//supprimer chaque pierre
		var that = this;
		chain.forEach(function(coords){
			that.go.model.removeStone(coords[0], coords[1]);
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
					
		neighbours.forEach(function(cell){					
			if ( !cell.isEmpty() && cell.getOwner() != player ){
				enemies++;
			}
		});
				
		return enemies >= neighbours.length;
	},
	
	noKo: function(x, y){
		alert('noko lol');
		return true;
	},
	
	nextPlayer: function(){
			
		if ( this.go.playerPassed >= 2 ) {
			this.endOfGame();
		}
		
		this.go.changeCurrentPlayer();
		//@todo true end game handler
		if (!this.playerCanPlay()) // @todo pas sûr si c'est le meilleur emplacement 
		{
			console.log('FIN DE PARTIE');
			alert('FIN DE PARTIE');
			// this.go.changeCurrentPlayer();
		}
		
		this.go.view.render(); // @todo on sait pas si on render toute la queue ou si le modèle render au fur et à mesure
		console.log("Joueur suivant ! : " + this.go.currentPlayer);
    
    this.recreateShootingIntervals();   
        
	},
	
	isKo: function() {
		console.log('in fn isko');
		var nbPl = [null, this.go.model.countPlayer(1), this.go.model.countPlayer(2)];
		
		for (var i = 0; i<this.history.length; i++)
		{
			if (this.history[i].nbPl[1] == nbPl[1] && this.history[i].nbPl[2] == nbPl[2] && this.go.model.getSerializedGoban() == this.history[i].goban)
				return true;
		}
		
		return false;
	},
	
	isKorama: function(xToR,yToR) {
		console.log('in fn iskorama');

		var nbPl = [null, this.go.model.countPlayer(1), this.go.model.countPlayer(2)];
		nbPl[this.getIntersection(xToR,yToR).getOwner()]--;
		
		for (var i = 0; i<this.history.length; i++)
		{
			if (this.history[i].nbPl[1] == nbPl[1] && this.history[i].nbPl[2] == nbPl[2] && this.go.model.getSerializedGoban() == this.history[i].goban)
				return true;
		}
		
		return false;
		
	},
    
    recreateShootingIntervals: function() {
		
		console.log('SHOOTING INTERVALS IGNORED');
		return;
		
        // ça m'a pris 30 minutes, me fais pas une axelade
        if (this.shootingInterval !== null)
            clearInterval(this.shootingInterval);
        var shootingFunctions = [];
        for (var x = 0; x<this.go.size; x++)
		{
			for (var y = 0; y<this.go.size; y++)
			{

				if (this.go.model.getIntersection(x,y).getOwner() == this.go.notCurrentPlayer && this.go.model.getIntersection(x,y).getType() == Go_Intersection.STONE_TURRET4)
                {
                    var shootingFunctionGenerator = function(x,y) {
                        var shooter = this.go.model.getIntersection(x,y).getOwner();
                        var neighbours = this.go.model.getNeighbours(x,y);
                        return function() {
                            
                                neighbours.forEach(function(neighbour){
									// J'AIME LE CODE ù.ù
									// HOURRI \i\
                                    if (!neighbour.isEmpty() && neighbour.getOwner() != shooter && !this.isKorama(x,y))
                                        neighbour.getHit();
                                });
                            };
                    };
                    
                    shootingFunctions.push(shootingFunctionGenerator(x,y));
                    
                }
			}
		}
        //console.log(this.shootingFunctions);
        var that = this;
        this.shootingInterval = setInterval( function() {
         //   console.log(that.shootingFunctions); that.shootingFunctions.forEach(function(fn){ fn(); });
            
            for (var i = 0; i<shootingFunctions.length; i++)
            {
                
                shootingFunctions[i]();
            }
            that.go.view.render();
        } , 1000);   
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

		console.log("## TryCapture, joueur "+player+" : " + x +" "+ y);

		function catchThemAll(x, y) {

			//pour chaque voisin, tester si le voisin est ennemi et si 
			//la chaine dont il fait partie est capturable
			var neighbours = that.go.model.getNeighboursCoords(x, y);	
			neighbours.forEach(function (coords){

				if (that.go.model.getIntersection(coords[0],coords[1]).getOwner() === 0) return;
				// if ennemy neighbour chain has no liberty
				if ( that.go.model.getIntersection(coords[0],coords[1]).getOwner() !== that.player && !that.chainHasLiberty(coords[0], coords[1]) ) { // @todo il faudrait pouvoir merge les tableaux de cellules visitées si les chaînes de deux neighbours se rencontrent (optimisation)

					console.log('Capture chain ' + coords[0] + ' ' + coords[1]);
					that.captureChain(coords[0], coords[1], player); // qu'est-ce que t'as fumé morgan putain

				}
			});	
		}

		//si oui et que no ko alors capture
		catchThemAll(x, y); 

	},

	/**
	 * Go_Controller.playerPass() increments playerPassed Counter and calls nextplayer
	 * @return {[type]} [description]
	 */
	playerPass: function(){
				
		this.go.playerPassed++;
		console.log('player passed');

		console.log(this.go.model.getSerializedGoban());
		console.log(this.go.playerPassed);
				
		if ( this.go.playerPassed >= 2 ) {
			this.go.controller.endOfGame();
		}
		this.go.controller.nextPlayer();
				
	},

	/**
	 * Go_Controller.playerHasPlayed() 
	 * @return {[type]} [description]
	 */
	playerHasPlayed: function(){
		this.resetPlayerPassedCounter();
		this.nextPlayer();
	},

	resetPlayerPassedCounter: function() {
		this.go.playerPassed = 0;
	},

	endOfGame: function(){
		alert("End Of Game <3");
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
			
/**
	
	[nouveau tour de joueur]
	//fait des trucs 
	 \si joueur passe
		  passMyTurn ( nextPlayer ) 

 */

// }

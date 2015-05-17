//en bas, dictionnaire des fonctions
var Go_Controller = dejavu.Class.declare({
	$extends: Go_MvcComponent,
    // inherit parent Go_Controller  

	placeStone: function(x,y) {
		if (this.go.model.isEmpty(x,y)) //ask Model "Is this case empty ?"
		{
			return true;

			//	dans le modèle on place la pierre, ce qui permet de faire comme si elle était placée
			//quitte à l'enlever plus tard
			this.go.model.setStone(x, y); 
			// récupérer depuis M les cases adjacentes
			//dans M, les cases sont des objets avec .state, .owner, .whatelse?
			//renvoie un tableau [N,E,S,W]
			var neighbours = this.go.model.getNeighbours(x, y);

			//  si il y a au moins une liberté
			if ( this.hasLiberty(neighbours) ){
				//placerPierre dans M et dans V
				this.setStone(x,y);

				if ( this.captureIsPossible(x,y) ){
					this.setStone(x,y);
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
		} else { //in cell aint empty
			this.returnError("owned cell");
		}
	},
	/**
	 * hasLiberty tells if a cell has a liberty or not
	 * @param  {[obj]}  neighbours object containing every neighbours of a cell
	 * @return {Boolean}   true : the cell has at least one liberty, false : no liberty
	 */
	hasLiberty : function(neighbours){
		var liberty = false;
		neighbours.forEach(function(e){
			if (e.state == 0 ) {
				liberty = true;
				break;
			}
		});
		return liberty;
	},
	/**
	 * 				#TODO : ce n'est pas sécurisé, vaut mieux placer ces actions au sein même 
	 * 				des sécurités de placeStone() ???
	 * setStone does everything in order to place a stone on the goban
	 * @param {[int]} x x position of a cell on the goban
	 * @param {[int]} y y position of a cell on the goban
	 */
	setStone : function(x, y){
		this.go.model.setStone(x, y);
		this.go.view.queue("setStone", {x, y});
		return true;
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
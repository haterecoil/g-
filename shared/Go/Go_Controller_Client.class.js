var Go_Controller_Client = dejavu.Class.declare({
	$extends: Go_Controller,
    // inherit parent Go_Controller  
	
	// Renvoie vraie si l'état actuel du jeu fait que la partie n'est pas d'office terminée
	gameCanGoOn: function(x,y) {
		return true;
	},

	placeStone: function(x,y) {
		if (this.$super(x,y))
		{
			// envoyer au serveur (via une autre classe ?) l'action qu'on vient de faire : socket emit ('placerPierre',[x,y]);
			
			if (this.gameCanGoOn())
			{
				this.go.model.placeStone(x,y);
				this.go.view.placeStone(x,y); // passer current player aussi ?
				this.go.changeCurrentPlayer();
				return true;
			}
			else
			{
			}
		}
		else
			return false;
	}
});
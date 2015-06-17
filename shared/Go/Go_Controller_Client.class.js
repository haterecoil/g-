var Go_Controller_Client = dejavu.Class.declare({
	$extends: Go_Controller,
    // inherit parent Go_Controller  
	

    
    placeStone: function(x,y) {
        this.$super(x,y);
        // socket.emit('placeStone',[x,y]);
    },

	setListeners: function() {
		
	}

	/*placeStone: function(x,y) {
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
	}*/
});
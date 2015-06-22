var Go_Controller_Client = dejavu.Class.declare({
	$extends: Go_Controller,
	
    placeStone: function(x,y) {
		if (this.go.currentPlayer != this.go.mePlayer) return false;
        return this.$super(x,y);
    }

});
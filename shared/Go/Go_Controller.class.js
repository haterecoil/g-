var Go_Controller = dejavu.Class.declare({
	$extends: Go_MvcComponent,
    // inherit parent Go_Controller  

	placeStone: function(x,y) {
		if (this.go.model.isEmpty(x,y))
		{
			// if not truc infini
			return true;
		}
		else
			return false; // ou on notifie la view d'une erreur direct ?
			
	}
	
	
});
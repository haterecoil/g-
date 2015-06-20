var Go_MvcComponent = dejavu.Class.declare({
	go: null,

	initialize: function(go) {
		console.log('Constructeur MVC Component !');
		// this.go = go;
	},
	
	setGo: function(go) {
		this.go = go;	
	}
	
});
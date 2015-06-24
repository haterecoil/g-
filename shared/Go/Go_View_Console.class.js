// lisetners à l'éinteirur de l vue

var Go_View_Console = dejavu.Class.declare({
	$extends: Go_View,
	
	render: function() {
		//console.log('render console');
	},

	log: function(message){
		console.log(message);
	}
});
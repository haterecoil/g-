// lisetners à l'éinteirur de l vue

var Go_View_HTML = dejavu.Class.declare({
	$extends: Go_View,
	
	render: function() {
		var goban = this.go.model.getGoban();
		$('body').empty();
		$pre = $('<pre></pre>');
		for (var y = 0; y<goban.length; y++)
		{
			for (var x = 0; x<goban[0].length; x++)
			{
				$pre.append(goban[x][y]);
			}
			$pre.append('\n');
		}
		$('body').append($pre);
		console.log('rendered');
	},
	
	placeStone: function() {
		this.render();
	}

	/*initialize: function(go) {
		console.log('[Go View HTML] PRE SUPER');
		this.$super(go);
		console.log('[Go View HTML] POST SUPER!');	
		console.log('[Go View HTML] THIS.GO : ' + this.go);	
	},
	*/
	/*getGo: function() { return this.go; }*/
	
});
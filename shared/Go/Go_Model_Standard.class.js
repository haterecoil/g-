var Go_Model_Standard = dejavu.Class.declare({
	$extends: Go_Model,
	goban: null,
	
	initialize: function(go) {
		this.$super(go);
		this.goban = [];
		for (var x = 0; x<this.go.size; x++)
		{
			var currentRow = [];
			for (var y = 0; y<this.go.size; y++)
			{
				currentRow.push(0);
			}
			this.goban.push(currentRow);
		}
		
		console.log(this.goban);
	},
	
	getGoban: function() {
		return this.goban;	
	},
	
	placeStone : function(x,y) {
		this.goban[x][y] = this.go.currentPlayer;	
	},
	
	isEmpty: function(x,y) {
		return this.goban[x][y] === 0;
	}
});



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
	
	// du top left dans le sens horaire
	// @todo vérif bordures
	// @todo classe "pierre" / "emplacement" ? et on retourne ces objets-là ?
	getNeighbours: function(x,y) {
		return [	this.goban[x-1][y-1],
					this.goban[x  ][y-1],
					this.goban[x+1][y-1],
					this.goban[x+1][y  ],
					this.goban[x+1][y+1],
					this.goban[x  ][y+1],
					this.goban[x-1][y+1],
					this.goban[x-1][y  ] ];
	}
	
	placeStone : function(x,y) {
		this.goban[x][y] = this.go.currentPlayer;	
	},
	
	isEmpty: function(x,y) {
		return this.goban[x][y] === 0;
	}
});



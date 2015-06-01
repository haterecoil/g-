var Go_Model_Standard = dejavu.Class.declare({
	$extends: Go_Model,
	goban: null,
	previousGoban : null,
	previousGoban2 : null,
	gobanClone : null,
	
	initialize: function(go) {
		this.$super(go);
		this.goban = [];
		this.previousGoban = "";
		this.previousGoban2 = "";
		for (var x = 0; x<this.go.size; x++)
		{
			var currentRow = [];
			for (var y = 0; y<this.go.size; y++)
			{
				currentRow.push( new Go_Intersection() );

				this.previousGoban+="3";
				this.previousGoban2+="3";
			}
			this.goban.push(currentRow);
		}
		
		console.log(this.goban);
	},
	
	getGoban: function() {
		return this.goban;	
	},

	setPreviousGoban: function() {
		this.previousGoban2 = "";
		var c = 0;
		for (var i = 0; i < this.go.size; i++) {
			for ( var j = 0; j < this.go.size; j++) {
				this.previousGoban2 += this.previousGoban[c++];						
			}
		}		
		this.previousGoban = "";
		for (var i = 0; i < this.go.size; i++) {
			for ( var j = 0; j < this.go.size; j++) {
				this.previousGoban += this.goban[i][j].getOwner();
			}
		}
	},	

	cloneCurrentGoban: function() {
		this.gobanClone = "";
		var c = 0;
		for (var i = 0; i < this.go.size; i++) {
			for ( var j = 0; j < this.go.size; j++) {
				this.gobanClone += this.previousGoban[c++];						
			}
		}		
	},

	currentGobanIsSameAsPrevious: function() {
		//get string from curr goban
		var str = "";
		for (var i = 0; i < this.go.size; i++) {
			for ( var j = 0; j < this.go.size; j++) {
				str += this.goban[i][j].getOwner();
			}
		}			
		
		if ( str === this.previousGoban2 ) return true;
		return false;
	},

	restorePreviousGoban: function() {
		var c = 0;
		for (var i = 0; i < this.go.size; i++) {
			for ( var j = 0; j < this.go.size; j++) {
				this.goban[i][j].setOwner(parseInt(this.gobanClone[c++]));
			}
		}	
	},
	
	// du top left dans le sens horaire
	// @todo vérif bordures
	// @todo classe "pierre" / "emplacement" ? et on retourne ces objets-là ?
	getNeighbours: function(x,y) {
		var neighbours = [];
	  if ( y-1 >= 0 ) neighbours.push(this.goban[x  ][y-1]);
		if ( x+1 <= this.go.size-1 ) neighbours.push(this.goban[x+1][y  ]);
		if ( y+1 <= this.go.size-1 ) neighbours.push(this.goban[x  ][y+1]);
		if ( x-1 >= 0 ) neighbours.push(this.goban[x-1][y  ]);				
		return neighbours;
	},

	getNeighboursCoords: function(x,y) {
		var neighbours = [];
	  if ( y-1 >= 0 ) neighbours.push([x  ,y-1]);
		if ( x+1 <= this.go.size-1 ) neighbours.push([x+1,y  ]);
		if ( y+1 <= this.go.size-1 ) neighbours.push([x  ,y+1]);
		if ( x-1 >= 0 ) neighbours.push([x-1,y  ]);
		return neighbours;
	},
	
	placeStone : function(x,y) {
		this.goban[x][y].setOwner(this.go.currentPlayer);	
	},
	removeStone : function(x,y) {
		this.goban[x][y].removeStone();	
	},
	
	getIntersection: function(x,y) {
		return this.goban[x][y];
	}
});



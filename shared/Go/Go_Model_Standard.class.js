var Go_Model_Standard = dejavu.Class.declare({
	$extends: Go_Model,
	goban: null,
	
	initialize: function(go) {
		this.$super(go);
		
	},
	
	placerPierre : function(x,y) {
		goban[x][y] = '';
		
	}
});



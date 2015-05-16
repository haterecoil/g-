var Go = dejavu.Class.declare({
	
	model: null,
	view: null,
	controller: null,
	size: null,
	currentPlayer: null,
	
	initialize: function(M,V,C,size) {
		this.size = size;
		this.model = new M(this);
		this.view = new V(this);
		this.controller = new C(this);
		this.currentPlayer = 1;
	},
	
	changeCurrentPlayer: function () {
		this.currentPlayer = (this.currentPlayer-1+1)%2+1; // 2 <-> 1
	}
});
var Go = dejavu.Class.declare({
	
	model: null,
	view: null,
	controller: null,
	size: null,
	mePlayer: null,
	currentPlayer: null,
	notCurrentPlayer: null,
	playerPassed: 0,
	roomName: null,
	
	initialize: function(M,V,C,params) {
		this.size = params.size;
		this.roomName = params.roomName;
		
		M.setGo(this);
		M.createGoban();
		this.model = M;
		
		V.setGo(this);
		this.view = V;
		
		C.setGo(this);
		this.controller = C;
		
		this.currentPlayer = 1;
		this.notCurrentPlayer = 2;
	},
	
	setMePlayer: function(playerId) {
		this.mePlayer = playerId;
	},
	
	changeCurrentPlayer: function () {
		this.currentPlayer = this.currentPlayer%2+1; // 2 <-> 1
		this.notCurrentPlayer = this.currentPlayer%2+1; // 1 <-> 2
	}
});
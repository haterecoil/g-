var Go = dejavu.Class.declare({
	
	model: null,							//reference the model object
	view: null,								//reference the view object
	controller: null,         //reference the controller object
	size: null,								//(int) : height and width of goban
	mePlayer: null,						//(int) : stores if client is black or white
	currentPlayer: null,      //(int) : indicates who must play this turn
	notCurrentPlayer: null,   //(int) : indicates who should not play
	playerPassed: 0,          //(int) : stores the number of passed turn
	roomName: null,						//(str) : name of current game room
	woopWoopCounter: 0,
	
	/**
	 * GO.initialize() create a go game from given M/V/C and params
	 * @param  {obj} M      Go's model
	 * @param  {obj} V      Go's view
	 * @param  {obj} C      Go's controller
	 * @param  {obj} params contains size and roomName
	 * @return {[type]}        [description]
	 */
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
	
	/**
	 * Go.setMePlayer() stores player's id
	 * @param {int} playerId 
	 */
	setMePlayer: function(playerId) {
		this.mePlayer = playerId;
	},
	
	/**
	 * Go.changeCurrentPlayer() sets current and next player
	 */
	changeCurrentPlayer: function () {
		this.currentPlayer = this.currentPlayer%2+1; // 2 <-> 1
		this.notCurrentPlayer = this.currentPlayer%2+1; // 1 <-> 2
	}
});
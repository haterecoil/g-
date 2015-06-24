var Go_Controller_Client_Socket = dejavu.Class.declare({
	$extends: Go_Controller_Client,
	socket: null,
	updateInterval: null,
    // inherit parent Go_Controller  
	
	initialize: function(socket) {
		console.log('Constructeur client socket');
		this.socket = socket;
	},

    
    placeStone: function(x,y,type) {

		if (this.go.currentPlayer != this.go.mePlayer) return false;

    if (this.$super(x,y,type)) // appelle placeStone du Go_Controller, et si c'est permis, emit socket
			{console.log(this.go);
			socket.emit('placeStone',{x: x, y: y, type: type, roomname: this.go.roomName, uuid: UUID.getUserUUID()});}
			
		else
			alert('NOOO');
    },
	
	playerPass: function() {
        this.$super() // appelle placeStone du Go_Controller, et si c'est permis, emit socket
		socket.emit('playerPass', {roomname: this.go.roomName, uuid: UUID.getUserUUID()});
    },
	
	initializeHandlers: function() {
		var that = this;
		socket.on('placeStone',function(data) {
			console.log("received place stone");
					
			if (data.roomname == that.go.roomName)
				that.go.controller.authorityPlaceStone(data.x, data.y, data.type);
			else
				alert('un coup est joué sur le goban '+data.roomname+' !');
		});
		socket.on('playerPass',function(coords) {
			that.go.controller.playerPass();
		});
		socket.on('update',function(serializedGoban) {
			that.updateHandler(serializedGoban);
		});
		socket.on('nope', function() {
			alert('Mouvement non autorisé');
			// @todo remove le dernier coup et switch back player
		});
		socket.on('createRoomSuccess', function (data){
			socket.emit('joinRoom', {roomname: data.roomname, uuid: UUID.getUserUUID()});
		});
		socket.on('createRoomError', function (error){
			alert(error);
		});

		socket.on('joinRoomError', function (error){
			alert(error);
		});
		socket.on('joinRoomSuccess', function (data){
			that.go.roomName = data.roomname;
			socket.emit('whatsMyColor', {roomname: that.go.roomName, uuid: UUID.getUserUUID()});
			socket.emit('itsMyTurn', {roomname: that.go.roomName, uuid: UUID.getUserUUID()});
			that.go.view.init();
		});
		socket.on('gameBegins', function() {
			console.log({roomname: that.go.roomName, uuid: UUID.getUserUUID()});

			socket.emit('whatsMyColor', {roomname: that.go.roomName, uuid: UUID.getUserUUID()});
			socket.emit('itsMyTurn', {roomname: that.go.roomName, uuid: UUID.getUserUUID()});

			that.go.view.init();
		});
		
		this.updateInterval = setInterval(function() {
			socket.emit('update');
		},5000); // on peut faire péter le serv avec des loops
	},

	updateHandler: function(serializedGoban) {
		this.go.model.setGobanFromSerialized(serializedGoban);
		this.go.view.render();
	}


	/*placeStone: function(x,y) {
		if (this.$super(x,y))
		{
			// envoyer au serveur (via une autre classe ?) l'action qu'on vient de faire : socket emit ('placerPierre',[x,y]);
			
			if (this.gameCanGoOn())
			{
				this.go.model.placeStone(x,y);
				this.go.view.placeStone(x,y); // passer current player aussi ?
				this.go.changeCurrentPlayer();
				return true;
			}
			else
			{
			}
		}
		else
			return false;
	}*/
});
var http = require('http'),
    fs = require('fs'),
    dejavu = require('dejavu');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, 'Nothing here. You\'re on the socket port.');
    res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// var bits = {};


eval(fs.readFileSync(__dirname+'/../shared/Go/Go.class.js')+'');
eval(fs.readFileSync(__dirname+'/../shared/Go/Go_MvcComponent.class.js')+'');
eval(fs.readFileSync(__dirname+'/../shared/Go/Go_Controller.class.js')+'');
eval(fs.readFileSync(__dirname+'/../shared/Go/Go_Controller_Server.class.js')+'');
eval(fs.readFileSync(__dirname+'/../shared/Go/Go_Model.class.js')+'');
eval(fs.readFileSync(__dirname+'/../shared/Go/Go_Model_Standard.class.js')+'');
eval(fs.readFileSync(__dirname+'/../shared/Go/Go_View.class.js')+'');
eval(fs.readFileSync(__dirname+'/../shared/Go/Go_View_Console.class.js')+'');
eval(fs.readFileSync(__dirname+'/../shared/Go/Go_Intersection.class.js')+'');

console.log('kikou <3');
	

//var go = new Go(Go_Model_Standard,Go_View_Console,Go_Controller_Server,5,5);
//go.view.log('kikou  <3 ');

// var rooms = [{
// 	players: [],
// 	room_id : 5,
// 	blackPlayer: null,
// 	whitePlayer: null,
// 	currentPlayer: null,
// 	go: null

// }];

var Room = function(){
	this.players = [];
	this.room_id = getTimestamp();
	this.blackPlayer = null;
	this.whitePlayer = null;
	this.currentPlayer = null;
	this.go = null;
	this.state = 'pending';
}

var rooms = {};

/**
 * List of socket events :
 * C/S 
 * 	>	connection
 *  > getRooms
 *  > joinRoom
 *  > createRoom
 *  > placeStone
 * <  rooms
 * <  joinError
 * <  joinSuccess
 * <  createRoomError
 * <  createRoomSuccess
 * <  nope
 * <> playerPass
 */
// Emit welcome message on connection
io.sockets.on('connection', function(socket) {

		socket.on('getUUID', function() {
			socket.emit('yourUUID', {uuid: getUUID()});
		});
    
		socket.on('getRooms', function (data){
						
			var ret = [];
			if ( Object.size(rooms) > 0 ) {

				for (var key in rooms) {

					if ( key.players && key.players.length < 2 ) {
						ret.push({
							roomName: key,
							roomId: rooms[key].room_id,
							protected: (rooms[key].password !== '')
						})
					} else if (key.players === undefined ) {
						ret.push({
							roomName: key,
							roomId: rooms[key].room_id,
							protected: (rooms[key].password !== '')
						})
					}
				}
						
				socket.emit('rooms', ret);	
			}
		})

		//console.log(socket);
		
		socket.on('joinRoom', function (data){

			roomName = data.roomname;
			console.log('in fn join room');
			console.log('data : ');
			console.log(data);
			console.log('room name : ' + roomName);
			
			console.log('rooms :');
			console.log(rooms);

			console.log('roomname in rooms ?');
			console.log(roomName in rooms);

			console.log("========== \n \n ");
					
			if ( roomName in rooms ) {
				if (rooms[roomName].players.length >= 2) {
					if ( playerInRoom(data.roomname, data.uuid) ) {
						socket.join(rooms[roomName].room_id);
						socket.emit('joinRoomSuccess', {roomname: data.roomname});
						socket.emit('update', rooms[roomName].go.model.getSerializedGobanWithHp());
						return;
					}
					socket.emit('joinError', 'le serveur est complet');
					return;
				} else {
					rooms[roomName].players.push(data.uuid);
					socket.join(rooms[roomName].room_id);
				}
			} else {
				socket.emit('joinError', 'erreur, veuillez recharger la page');
				return;
			}

			console.log('joinRoom received');
			socket.emit('youClicked');

			console.log(rooms[roomName].players.length);
					
			if ( rooms[roomName].players.length >= 2 ) { // GAME START MOTHERFUCKER
				var goParams = { size:5, 'roomName': roomName }
				rooms[roomName].go = new Go(new Go_Model_Standard,new Go_View_Console,new Go_Controller_Server,goParams);
				
				var rdmBlackPlayer = Math.floor(Math.random()*2);
				console.log('rdm black player : ' + rdmBlackPlayer);
				console.log('player rdm :'+rooms[roomName].players[rdmBlackPlayer]);
						
						
				if ( rdmBlackPlayer == 1  )
					rdmWhitePlayer = 0;
				else
					rdmWhitePlayer = 1;

				rooms[roomName].blackPlayer = rooms[roomName].players[rdmBlackPlayer];
				rooms[roomName].whitePlayer = rooms[roomName].players[rdmWhitePlayer];
				rooms[roomName].currentPlayer = rooms[roomName].blackPlayer;

				console.log(rooms[roomName]);
						

				// io.to(rooms[roomName].room_id).emit('joinRoomSuccess');

				// io.to(rooms[roomName].blackPlayer).emit('youAreBlack');
				// io.to(rooms[roomName].whitePlayer).emit('youAreWhite');
						
				io.to(rooms[roomName].room_id).emit('gameBegins');

			}
		});	

		socket.on('whatsMyColor', function (data){
			if( !requestIsValid(data) ) {
				console.log('invalid request');
				console.log(data);

				return false;
			}
			if ( data.uuid == rooms[data.roomname].blackPlayer ) 
				socket.emit('youAreBlack');
			else 
				socket.emit('youAreWhite');
		});

		socket.on('itsMyTurn', function (data){
			if ( requestIsValid(data) ) {
				console.log('turn of ' + data.uuid == rooms[data.roomname].currentPlayer);
						
				if ( data.uuid == rooms[data.roomname].currentPlayer )
					socket.emit('yourTurn');

			} else {
				console.log('invalid :o');
				console.log(data);
						
			}
		});

		socket.on('update', function (data) {
			socket.emit('update', rooms[data.roomname].go.model.getSerializedGobanWithHp());

		});

		socket.on('createRoom', function (data){
			if ( data.roomname in rooms ) {
				socket.emit('createRoomError', 'ce nom de room existe déjà' );
			} else {
				rooms[data.roomname] = new Room();
				socket.emit('createRoomSuccess', {roomname: data.roomname});
			}
		});

    socket.on('placeStone', function (params) {
			console.log('placestone');
			console.log(JSON.stringify(params));
			console.log(rooms[params.roomname]);
					
					
			if ( !rooms[params.roomname] ) {
				socket.emit('joinRoomError', 'pas de room un cinomé'+params.roomname);
				return;
			}
			else if ( !params.uuid in rooms[params.roomname].players ){
				socket.emit('joinRoomError', 'vous flou dans la room :x');
				return;
			}		
			else if ( params.uuid != rooms[params.roomname].currentPlayer ){
				socket.emit('nope');
				return;
			}
			else if (!rooms[params.roomname].go.controller.placeStone(params.x,params.y,params.type)){
				socket.emit('nope');
				return;
			}
			
			changeCurrentPlayer(rooms[params.roomname]);

			console.log(io.sockets.adapter.rooms[rooms[params.roomname].room_id]);			
			socket.broadcast.to(rooms[params.roomname].room_id).emit('placeStone',params);
    });
	
	socket.on('playerPass', function (params) {
        socket.broadcast.to(rooms[params.roomname].room_id).emit('playerPass',params);
    });


});

// @todo verif si obj contient left top text etc.

app.listen(9090);

function getTimestamp(){
	var time = process.hrtime();
	return Math.round( time[ 0 ] * 1e3 + time[ 1 ] / 1e6 );
}

function getUUID(){
	return getTimestamp()+Math.ceil(Math.random()*99);
}

function requestIsValid(data){
	if ( data.uuid) {
		data.uuid = data.uuid.toString();
	}
	if ( rooms[data.roomname] ) {
		if (playerInRoom(data.roomname, data.uuid)){
			return true;
		}
	}
	console.log('not valid : ');
	console.log(data);
			
			
	return false;
}

function playerInRoom(room, uuid) {
	if ( uuid == rooms[room].players[0] || uuid == rooms[room].players[1] )
		return true;
	return false;
}

function changeCurrentPlayer(room) {
	if ( room.currentPlayer == room.blackPlayer ) 
		room.currentPlayer = room.whitePlayer;
	else
		room.currentPlayer = room.blackPlayer;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


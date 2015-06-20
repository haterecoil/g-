var http = require('http'),
    fs = require('fs'),
    dejavu = require('dejavu')

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, 'Nothing here. You\'re on the socket port.');
    res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

var bits = {};


eval(fs.readFileSync('../shared/Go/Go.class.js')+'');
eval(fs.readFileSync('../shared/Go/Go_MvcComponent.class.js')+'');
eval(fs.readFileSync('../shared/Go/Go_Controller.class.js')+'');
eval(fs.readFileSync('../shared/Go/Go_Controller_Server.class.js')+'');
eval(fs.readFileSync('../shared/Go/Go_Model.class.js')+'');
eval(fs.readFileSync('../shared/Go/Go_Model_Standard.class.js')+'');
eval(fs.readFileSync('../shared/Go/Go_View.class.js')+'');
eval(fs.readFileSync('../shared/Go/Go_View_Console.class.js')+'');
eval(fs.readFileSync('../shared/Go/Go_Intersection.class.js')+'');

console.log('kikou <3');
		

//var go = new Go(Go_Model_Standard,Go_View_Console,Go_Controller_Server,5,5);
//go.view.log('kikou  <3 ');

var rooms = [{
	players: [],
	room_id : getTimestamp(),
	blackPlayer: null,
	whitePlayer: null,
	currentPlayer: null

}];


// Emit welcome message on connection
io.sockets.on('connection', function(socket) {
    
		//console.log(socket);
		
		socket.on('joinRoom', function(){
			
			// console.log('Y U JOIN ?');
					

			rooms[0].players.push({ socket_id: socket.id });
			// socket.join(rooms[0].room_id); @todo WHAT

			// console.log(JSON.stringify(rooms));
				
			// console.log('room mates ');
			// console.log(io.nsps['/'].adapter.rooms[rooms[0].room_id]);
					
			socket.emit('youClicked');

			if ( rooms[0].players.length >= 2 ) {
				// console.log('room is full');
						
				var rdmBlackPlayer = Math.floor(Math.random()*2);
				
				if ( rdmBlackPlayer == 1  )
					rdmWhitePlayer = 0;
				else
					rdmWhitePlayer = 1;
				
					// console.log('random number : ' + rdmBlackPlayer);
						
				// console.log('inverse of rdm is : ' + rdmWhitePlayer);
						
				// console.log(rooms[0].players[rdmBlackPlayer]);
				// console.log(rooms[0].players[rdmWhitePlayer]);
						
				rooms[0].blackPlayer = rooms[0].players[rdmBlackPlayer].socket_id;
				rooms[0].whitePlayer = rooms[0].players[rdmWhitePlayer].socket_id;
				rooms[0].currentPlayer = rooms[0].blackPlayer;

				// console.log(JSON.stringify(rooms));

				socket.to(rooms[0].blackPlayer).emit('youAreBlack');
				socket.to(rooms[0].whitePlayer).emit('youAreWhite');

				/*console.log(rooms[0].blackPlayer);
				console.log(rooms[0].whitePlayer);*/
						

				socket.to(rooms[0].room_id).emit('gameBegins');
				// console.log(rooms[0].room_id);
						
				socket.emit(rooms[0].blackPlayer).emit('yourTurn');
			}
					
		});	

    socket.on('placeStone', function(params) {
        socket.broadcast.emit('placeStone',params);
    })
});

// @todo verif si obj contient left top text etc.

app.listen(9090);

function beginGame(){
	var blackPlayer = rooms[0].players[Math.floor(Math.random()*2)]
}

function getTimestamp(){
	var time = process.hrtime();
	return Math.round( time[ 0 ] * 1e3 + time[ 1 ] / 1e6 );
}




var go = new Go(new Go_Model_Standard,new Go_View_HTML,new Go_Controller_Client_Socket(socket),5,5);

go.view.init();
var socket = io('http://localhost:9090');

socket.emit('joinRoom',0);
go.controller.initializeHandlers();





function connect(){
	socket.emit('joinRoom');
}



/**
 * SOCKET IO
 */

socket.on('youAreBlack', iAmBlack);
socket.on('youAreWhite', iAmWhite);
socket.on('gameBegins',  gameBegins);
socket.on('yourTurn',    myTurn);
socket.on('youClicked',    youClicked);

function iAmBlack(){
	log('me black lol');
			
}
function iAmWhite(){
	log('me white lel');
			
}
function gameBegins(){
	log('lets do this');
			
}
function myTurn(){
	log('fire in my hole');			
}

function log(message){
	$('.log').append(message + '  <br/>');
}

function youClicked(){
	log('you clickd <3');
}





function testCapture(){
	go.model.getIntersection(2,1).setOwner(1);
	go.model.getIntersection(0,2).setOwner(1);
	go.model.getIntersection(1,2).setOwner(1);
	go.model.getIntersection(2,2).setOwner(1);

	
	go.view.render();
}
function testCapture2(){
	go.model.getIntersection(1,1).setOwner(2);
	go.model.getIntersection(0,1).setOwner(2);


	
	go.view.render();
}

function testFullVoid(){
	go.model.getIntersection(2,1).setOwner(0);
	go.model.getIntersection(0,2).setOwner(0);
	go.model.getIntersection(1,2).setOwner(0);
	go.model.getIntersection(2,2).setOwner(0);
	go.model.getIntersection(1,1).setOwner(0);
	go.model.getIntersection(0,1).setOwner(0);

}
function testFullEnd(){
	go.model.getIntersection(2,1).setOwner(1);
	go.model.getIntersection(2,0).setOwner(1);
	go.model.getIntersection(0,2).setOwner(1);
	go.model.getIntersection(1,2).setOwner(1);
	go.model.getIntersection(2,2).setOwner(1);
	go.model.getIntersection(1,1).setOwner(0);
	go.model.getIntersection(0,0).setOwner(1);
	go.model.getIntersection(0,1).setOwner(0);
	go.model.getIntersection(1,0).setOwner(0);

}

function testKo(){	
	/*go.model.getIntersection(2,1).setOwner(2);
	go.model.getIntersection(3,2).setOwner(2);
	go.model.getIntersection(1,2).setOwner(2);
	go.model.getIntersection(2,3).setOwner(2);

	go.model.getIntersection(1,1).setOwner(1);
	go.model.getIntersection(0,2).setOwner(1);
	go.model.getIntersection(1,3).setOwner(1);*/
    
	// go.model.getIntersection(0,1).setOwner(2).setType(Go_Intersection.STONE_TURRET4);

	go.view.render();
    
    go.controller.recreateShootingIntervals();
}

setTimeout(function() {
	testKo();
},100);
/*

socket.on('placeStone',function(params) {
    params;
});*/

// rooms
/*

var Rooms = function () {

	
	return {
		handlers:
			{
				getRooms: function(rooms) {
					$('.rooms').empty();
					rooms.forEach(function (i, el) {
						$('rooms').append('<li><a href="#"> ' + el.name ' </a></li>');
					});
				}
			},
		
	}
}

*/

setInterval(function() { socket.emit('getRooms'); }, 3000);

socket.on('rooms', function(rooms) {
	$('.lobby__rooms').empty();
	rooms.forEach(function (i, el) {
		$('.lobby__rooms').append($('<li><a href="#"> ' + el.roomName + ' </a></li>').data('roomId',el.roomId));
	});
});

$('.lobby__rooms').on('click','a', function() {
	alert('JOIN ROOM : ' + $(this).parent().data('roomId'));
	socket.emit('joinRoom',{roomId: $(this).parent().data('roomId')});
	$('.lobby').hide();
	$('.game').show();
	return false;
});


$('.lobby__createRoom').click(function() {
	socket.emit('createRoom',{roomName: prompt('Nom ?')});
	$('.lobby').hide();
	$('.game').show();
});








var local_only = true;



if (!local_only)
{
	var socket = io('http://localhost:9090');
}
else
	var socket = {emit: function(){}, on: function(){}};
	
// go.controller.initializeHandlers();

var goParams = {
	size: 5,
	roomName: null
};

var go;

var UUID = {
	setUserUUID: function (uuid) {
		localStorage.setItem("uuid", uuid);
	},
	getUserUUID: function () {
		return localStorage.getItem("uuid");
	},
	UUIDisEmpty: function () {
		if ( localStorage.getItem("uuid") ) {
			return false;
		} else {
			return true;
		}
	}	
}
		
if ( UUID.UUIDisEmpty() ) {
	socket.emit('getUUID');
}
socket.on('yourUUID', function (data){
	UUID.setUserUUID(data.uuid);
});

setInterval(function() { socket.emit('getRooms'); }, 3000);

socket.on('rooms', function(rooms) {
	$('.lobby__rooms').empty();
	for( el in rooms ) {
		console.log(rooms[el].roomName);
		$('.lobby__rooms').append($('<li data-roomname="'+rooms[el].roomName+'"" ><a href="#"> ' + rooms[el].roomName + ' </a></li>'));
	};
});


/**
 * JOIN ROOM
 */
$('.lobby__rooms').on('click','a', function() {

	alert('JOIN ROOM : ' + $(this).parent().data('roomname'));
	
	goParams.roomName = $(this).parent().data('roomname');

	console.log('join room with name : '+ $(this).parent().data('roomname') + 'var is ' + JSON.stringify(goParams));
			
if (local_only) 
	go = new Go(new Go_Model_Standard,new Go_View_HTML,new Go_Controller_Client,goParams);
else
	go = new Go(new Go_Model_Standard,new Go_View_HTML,new Go_Controller_Client_Socket(socket),goParams);	

go.controller.initializeHandlers();

	socket.emit('joinRoom',{roomname: goParams.roomName, uuid: UUID.getUserUUID()});


	$('.lobby').hide();
	$('.game').show();
	return false;
});

/**
 * CREATE ROOM
 */
$('.lobby__createRoom').click(function() {
	var roomname = prompt('Nom ?');

	goParams.roomName = roomname;
	console.log('create room with name : ' + roomname);

	if (local_only) // nagui
	{
		go = new Go(new Go_Model_Standard,new Go_View_HTML,new Go_Controller_Client,goParams);
		go.view.render();
	}
	else
	{
		go = new Go(new Go_Model_Standard,new Go_View_HTML,new Go_Controller_Client_Socket(socket),goParams);
		go.controller.initializeHandlers();

		socket.emit('createRoom',{roomname: goParams.roomName});

		$('.lobby').hide();
		$('.game').show();
	}
});

	/**
	 *  LOCAL STORAGE
	 */
	




/**
 * SOCKET IO
 */

socket.on('youAreBlack', iAmBlack);
socket.on('youAreWhite', iAmWhite);
// socket.on('gameBegins',  gameBegins);
// socket.on('yourTurn',    myTurn);
socket.on('youClicked',    youClicked);
socket.on('joinError', function(d){console.log(d);})

function iAmBlack() {
	log('me black lel');
	go.setMePlayer(1);
}

function iAmWhite(){
	log('me white lel');
	go.setMePlayer(2);
}

// function gameBegins(){
// 	log('lets do this');

// }
// function myTurn(){
// 	log('fire in my hole');			
// }

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



// For PASS
var pass = document.querySelector('.button-pass');
pass.addEventListener("click", checkPass);

function checkPass() {
   document.querySelector(".pass-warning").style.transform = "scale(1)";
}
//Validate or not
var optionPass = document.querySelector('.option-pass');
var validatePass = optionPass.getElementsByTagName('a');
validatePass[0].addEventListener("click", validatePass);
validatePass[1].addEventListener("click", validatePass);

function validatePass(){
	document.querySelector(".pass-warning").style.transform= "scale(0)";
}

// For ABANDON
var pass = document.querySelector('.button-abandon');
pass.addEventListener("click", checkAbandon);

function checkAbandon() {
   document.querySelector(".abandon-warning").style.transform = "scale(1)";
}
//Validate or not
var optionPass = document.querySelector('.option-abandon');
var validateAbandon = optionPass.getElementsByTagName('a');
validatePass[0].addEventListener("click", validateAbandon);
validatePass[1].addEventListener("click", validateAbandon);

function validateAbandon(){
	document.querySelector(".abandon-warning").style.transform= "scale(0)";
}












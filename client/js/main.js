var go = new Go(Go_Model_Standard,Go_View_HTML,Go_Controller_Client,5,5);

go.view.init();

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

var socket = io.connect('http://141.138.157.211:9090');
socket.on('placeStone',function(params) {
    params;
});*/
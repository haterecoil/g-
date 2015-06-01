var go = new Go(Go_Model_Standard,Go_View_HTML,Go_Controller_Client,5,5);


go.view.render();

function testCapture(){
	go.model.getIntersection(2,0).setOwner(2);
	go.model.getIntersection(4,0).setOwner(2);
	go.model.getIntersection(3,1).setOwner(2);
	go.model.getIntersection(1,0).setOwner(1);
	go.model.getIntersection(2,1).setOwner(1);
	go.model.getIntersection(3,2).setOwner(1);
	go.model.getIntersection(4,1).setOwner(1);
	
	go.view.render();
}

function testKo(){
	go.model.getIntersection(2,1).setOwner(2);
	go.model.getIntersection(3,2).setOwner(2);
	go.model.getIntersection(1,2).setOwner(2);
	go.model.getIntersection(2,3).setOwner(2);

	go.model.getIntersection(1,1).setOwner(1);
	go.model.getIntersection(0,2).setOwner(1);
	go.model.getIntersection(1,3).setOwner(1);
    
	go.model.getIntersection(0,1).setOwner(2).setType(Go_Intersection.STONE_TURRET4);

	go.view.render();
    
    go.controller.recreateShootingIntervals();
}

setTimeout(function() {
	testKo();
},100);
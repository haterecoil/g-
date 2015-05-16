var go = new Go(Go_Model_Standard,Go_View_HTML,Go_Controller_Client,16,16);


go.view.render();

setTimeout(function() {
	go.controller.placeStone(3,0);
	
},2000);
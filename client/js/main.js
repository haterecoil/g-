var go = new Go(Go_Model_Standard,Go_View_HTML,Go_Controller_Client,5,5);


go.view.render();


setTimeout(function() {
	go.controller.placeStone(3,0);
	go.controller.testCapture();
},100);
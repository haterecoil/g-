var http = require('http'),
    fs = require('fs')

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


var go = new Go(Go_Model_Standard,Go_View_HTML,Go_Controller_Client,5,5);

// Emit welcome message on connection
io.sockets.on('connection', function(socket) {

    console.log(bits);
    
    socket.on('placeStone', function(params) {
        socket.broadcast.emit('placeStone',params);
    });
});

// @todo verif si obj contient left top text etc.

app.listen(9090);
module.exports = ()=>{
  var WebSocketServer = require('websocket').server;
  var http = require('http');

  var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets
    // server we don't have to implement anything.
  });
  server.listen(1337, function() { });
  console.log('websockets');
  // create the server
  wsServer = new WebSocketServer({
    httpServer: server
  });
  
  let quizData = {
      "How many branches of government does the U.S. have?": "3",
      "At a four-way intersection when the traffic light does not work, is it a 4-way stop? Enter true or false.": "true"
  }

  // WebSocket server
  wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);

    let isWhitelisted = false;
    ['slate-central', 'localhost'].forEach((member)=>{
      if(request.origin.indexOf(member) > -1) {
        isWhitelisted = true;
      };
    });
    if (!isWhitelisted) {
      connection.sendUTF(
          JSON.stringify({ message : "Please use from same origin or approved host."}));
    }
    else {
      // This is the most important callback for us, we'll handle
      // all messages from users here.
      connection.on('message', function(message) {
        if (message.type === 'utf8') {
          // process WebSocket message
          var os = require("os");
          var hostname = os.hostname();
          console.log('received message:'+JSON.stringify(message));
          connection.sendUTF(
              JSON.stringify({
                type: "message",
                data: {
                  message : "Thanks."
                }
              }));
        }
      });
    }

    connection.on('close', function(connection) {
      // close user connection
      console.log('close');
    });
  });  
}

module.exports = ()=>{
  "use strict";
  // Optional. You will see this name in eg. 'ps' or 'top' command
  process.title = 'node-chat';
  // Port where we'll run the websocket server
  var webSocketsServerPort = 1337;
  // websocket and http servers
  var webSocketServer = require('websocket').server;
  var http = require('http');
  /**
   * Global variables
   */
  // latest 100 messages
  var histories = {};
  var history = [ ];
  var quizHistory = {};
  // list of currently connected clients (users)
  var clients = [ ];
  /**
   * Helper function for escaping input strings
   */
  function htmlEntities(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  // Array with some colors
  var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
  // ... in random order
  colors.sort(function(a,b) { return Math.random() > 0.5; } );
  /**
   * HTTP server
   */
  var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server,
    // not HTTP server
  });
  server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port "
        + webSocketsServerPort);
  });
  /**
   * WebSocket server
   */
  var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket
    // request is just an enhanced HTTP request. For more info 
    // http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
  });
  
  let quizDataOriginal = {
      "How many branches of government does the U.S. have?": "3",
      "Santa Clara is in southern California, T or F?": "F",
      "At a four-way intersection when the traffic light does not work, is it a 4-way stop? Enter T or F.": "T"
  };
  let quizDatas = {};
  let quizSubjectFirstEntry;
  let questionCorrectness = '';
  // This callback function is called every time someone
  // tries to connect to the WebSocket server
  wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin '
        + request.origin + '.');
    // accept connection - you should check 'request.origin' to
    // make sure that client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)

    let isWhitelisted = false;
    ['slate-central', 'localhost'].forEach((member)=>{
      if(request.origin.indexOf(member) > -1) {
        isWhitelisted = true;
      };
    });
    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    if (!isWhitelisted) {
      connection.sendUTF(
          JSON.stringify({ message : "Please use from same origin or approved host."}));
    }
    else {
      var index = clients.push(connection) - 1;
      var userName = false;
      var userColor = false;
      let chosenQuestion,
          chosenQuestions = [];
      console.log((new Date()) + ' Connection accepted.');
      let connectionID = Date.now();
      quizDatas[connectionID] = Object.assign({}, quizDataOriginal);
      history = histories[colors.shift() + Date.now()] = [];
      
      // send back chat history
      if (history.length > 0) {
        connection.sendUTF(
            JSON.stringify({ type: 'history', data: history} ));
      }
      // user sent some message
      connection.on('message', function(message) {
        var quizUsers = ['qm', 'quizme'];
        if (message.type === 'utf8') { // accept only text
        // first message sent by user is their name
        function handleQuizUser() {
          if (!quizSubjectFirstEntry) {
            var obj = {
                time: (new Date()).getTime(),
                text: htmlEntities(message.utf8Data),
                author: userName,
                color: userColor
              };
            history.push(obj);
          }
          else {
            quizDatas[connectionID] = Object.assign({}, quizDataOriginal);
          }
          var roboObj = {
              time: (new Date()).getTime(),
              author: 'RoboQuizAssistant',
              color: userColor
          }
          if (message.utf8Data === 't' || message.utf8Data === 'f') {
            message.utf8Data = message.utf8Data.toUpperCase();
          }
          if (history.length < 1 || quizSubjectFirstEntry || quizUsers.includes(userName) && history.length > 1 && history.slice(-1)[0].text.indexOf('finished the questions') > -1) {
            questionCorrectness = "";
          }
          else if (history.length > 0 && message.utf8Data === history.slice(-1)[0].answer) {
            questionCorrectness = "Correct. ";
          }
          else {
            questionCorrectness = "Incorrect. ";
          }
          if (quizUsers.includes(userName)) {
            if (Object.keys(quizDatas[connectionID]).length < 1) {
              roboObj.text = questionCorrectness + 'Thank you for taking the quiz. You finished the questions!';
            }
            else {
              chosenQuestion = parseInt(Math.random() * Object.keys(quizDatas[connectionID]).length);
              roboObj.question = Object.keys(quizDatas[connectionID])[chosenQuestion];
              roboObj.answer = quizDatas[connectionID][roboObj.question];
              roboObj.text = questionCorrectness + roboObj.question;
              delete quizDatas[connectionID][roboObj.question];
            }
          }
          history.push(roboObj);
          history = history.slice(-100);
          // broadcast message to all connected clients
          if (!quizSubjectFirstEntry && quizUsers.includes(userName)) {
            var json = JSON.stringify({ type:'message', data: obj });
            connection.sendUTF(json);
          }
          var roboJson = JSON.stringify({ type:'message', data: roboObj });
          if (quizUsers.includes(userName)) {
            connection.sendUTF(roboJson);
          }
        } // end handleQuizUser
        if (userName === false) {
          // remember user name
          userName = htmlEntities(message.utf8Data);
          // get random color and send it back to the user
          quizSubjectFirstEntry = htmlEntities(message.utf8Data) === userName;
          userColor = colors.shift();
          connection.sendUTF(
              JSON.stringify({ type:'color', data: userColor }));
          console.log((new Date()) + ' User is known as: ' + userName
                      + ' with ' + userColor + ' color.');
          if (quizUsers.includes(userName)) {
            handleQuizUser();
          }
        }
        
         else { // log and broadcast the message
            console.log((new Date()) + ' Received Message from '
                        + userName + ': ' + message.utf8Data);
            
            // we want to keep history of all sent messages
            var obj = {
              time: (new Date()).getTime(),
              text: htmlEntities(message.utf8Data),
              answer: htmlEntities(message.answer),
              author: userName,
              color: userColor
            };
            var roboObj = {
                time: (new Date()).getTime(),
                author: 'RoboQuizAssistant',
                color: userColor
            }
            if (message.utf8Data === 't' || message.utf8Data === 'f') {
              message.utf8Data = message.utf8Data.toUpperCase();
            }
            if (history.length < 1 || quizUsers.includes(userName) && history.length > 1
                && history.slice(-1)[0].text && history.slice(-1)[0].text.indexOf('finished the questions') > -1) {
              questionCorrectness = "";
            }
            else if (history.length > 0 && message.utf8Data === history.slice(-1)[0].answer) {
              questionCorrectness = "Correct. ";
            }
            else {
              questionCorrectness = "Incorrect. ";
            }
            if (quizUsers.includes(userName)) {
              if (Object.keys(quizDatas[connectionID]).length < 1) {
                roboObj.text = questionCorrectness + 'Thank you for taking the quiz. You finished the questions!';
              }
              else {
                chosenQuestion = parseInt(Math.random() * Object.keys(quizDatas[connectionID]).length);
                roboObj.question = Object.keys(quizDatas[connectionID])[chosenQuestion];
                roboObj.answer = quizDatas[connectionID][roboObj.question];
                roboObj.text = questionCorrectness + roboObj.question;
                delete quizDatas[connectionID][roboObj.question];
              }
            }
            history.push(obj);
            history.push(roboObj);
            history = history.slice(-100);
            // broadcast message to all connected clients
            var json = JSON.stringify({ type:'message', data: obj });
            var roboJson = JSON.stringify({ type:'message', data: roboObj });
            if (quizUsers.includes(userName)) {
              connection.sendUTF(json);
              connection.sendUTF(roboJson);
            }
            else {
              for (var i=0; i < clients.length; i++) {
                clients[i].sendUTF(json);
              }
            }
          } // end // log and broadcast the message
        }
      });
    }
    // user disconnected
    connection.on('close', function(connection) {
      if (userName !== false && userColor !== false) {
        console.log((new Date()) + " Peer "
            + connection.remoteAddress + " disconnected.");
        // remove user from the list of connected clients
        clients.splice(index, 1);
        // push back user's color to be reused by another user
        colors.push(userColor);
      }
    });
  });
}
var path = require("path");
var express = require("express");
var api = express();

api.use("/static", express.static(__dirname + "/static"));

// Routing
api.get("/", function(request, response) {
  response.sendFile(path.join(__dirname, "index.html"));
});

api.get("/game/:id", function(request, response) {
  let id = parseInt(request.params.id);

  switch (id) {
    case 1:
      response.sendFile(path.join(__dirname, "/static/game_one/game.html"));
      break;
    case 2:
      response.sendFile(path.join(__dirname, "/static/game_two/game.html"));
      break;
    default:
      response.send({ message: "No game found with that id" });
  }
});

module.exports = api;

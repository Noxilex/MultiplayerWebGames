// Dependencies
var express = require("express");
var http = require("http");
var path = require("path");
var socketIO = require("socket.io");

var api = express();
var server = http.Server(api);
var io = socketIO(server);

// API
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

class Client {
  constructor(id) {
    this.x = 300;
    this.y = 300;
    this.id = id;
    this.color = `rgb(${Math.random() * 255}, ${Math.random() *
      255}, ${Math.random() * 255}`;
  }
}

// Starts the server.
server.listen(5000, "0.0.0.0", function() {
  console.log("Starting server on port 5000");
});

// Add the WebSocket handlers
var clients = {};
//var channels = {};
io.on("connection", function(socket) {
  socket.on("new player", function() {
    clients[socket.id] = new Client(socket.id);
  });
  socket.on("movement", function(data) {
    var client = clients[socket.id] || {};
    if (data.left) {
      client.x -= 5;
    }
    if (data.up) {
      client.y -= 5;
    }
    if (data.right) {
      client.x += 5;
    }
    if (data.down) {
      client.y += 5;
    }
  });

  socket.on("new_shogi_player", function() {
    console.log("New shogi player connected");
    io.sockets.emit("plateauUpdate", plateau.getPlateau());
  });
});

//GAME 2
class Case {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.content = {};
  }
}

class Plateau {
  constructor(nbLignes, nbColonnes) {
    this.nbLignes = nbLignes;
    this.nbColonnes = nbColonnes;
    this.init();
  }

  init() {
    //Fills the plateau with empty cases
    this.reset();
    //3rd line - Pawns
    for (var i = 0; i < 9; i++) {
      //Black
      let black_pawn_c = this.getCase(i, 2).content;
      black_pawn_c.team = "black";
      black_pawn_c.name = "pawn";
      //White
      let white_pawn_c = this.getCase(i, 6).content;
      white_pawn_c.team = "white";
      white_pawn_c.name = "pawn";
    }
    //2nd line - Bishop & Rook
    //Black
    let black_bishop_c = this.getCase(1, 1).content;
    black_bishop_c.team = "black";
    black_bishop_c.name = "bishop";
    let black_rook_c = this.getCase(7, 1).content;
    black_rook_c.team = "black";
    black_rook_c.name = "rook";
    //White
    let white_bishop_c = this.getCase(1, 7).content;
    white_bishop_c.team = "white";
    white_bishop_c.name = "bishop";
    let white_rook_c = this.getCase(7, 7).content;
    white_rook_c.team = "white";
    white_rook_c.name = "rook";
    //3rd line - Lancer/Knight/Silver/Gold/King/(reverse)
    var rows = [0, 8];
    for (let i = 0; i < rows.length; i++) {
      let team = (i == 0) ? "black" : "white";
      let lancer1_c = this.getCase(0, rows[i]).content;
      lancer1_c.name = "lancer";
      lancer1_c.team = team;
      let knight1_c = this.getCase(1, rows[i]).content;
      knight1_c.name = "knight";
      knight1_c.team = team;
      let silver1_c = this.getCase(2, rows[i]).content;
      silver1_c.name = "silver";
      silver1_c.team = team;
      let gold1_c = this.getCase(3, rows[i]).content;
      gold1_c.name = "gold";
      gold1_c.team = team;
      let king_c = this.getCase(4, rows[i]).content;
      king_c.name = "king";
      king_c.team = team;
      let gold2_c = this.getCase(5, rows[i]).content;
      gold2_c.name = "gold";
      gold2_c.team = team;
      let silver2_c = this.getCase(6, rows[i]).content;
      silver2_c.name = "silver";
      silver2_c.team = team;
      let knight2_c = this.getCase(7, rows[i]).content;
      knight2_c.name = "knight";
      knight2_c.team = team;
      let lancer2_c = this.getCase(8, rows[i]).content;
      lancer2_c.name = "lancer";
      lancer2_c.team = team;
    }
  }

  reset() {
    this.plateau = [];
    for (let i = 0; i < this.nbColonnes; i++) {
      let colonne = [];
      for (let j = 0; j < this.nbLignes; j++) {
        colonne.push(new Case(i, j, {}));
      }
      this.plateau.push(colonne);
    }
  }

  getCase(x, y) {
    return this.plateau[x][y];
  }

  getPlateau() {
    return this.plateau;
  }
}

var plateau = new Plateau(9, 9);

setInterval(function() {
  io.sockets.emit("state", clients);
}, 1000 / 60);

// setInterval(function() {
//   io.sockets.emit('plateauUpdate', plateau);
// }, 1000 / 60);

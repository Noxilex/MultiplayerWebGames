// Dependencies
var packageVersion = require('./package.json').version;
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

api.get("/game/:name", function(request, response) {
  let name = request.params.name;
  console.log(name)
  switch (name) {
    case "one":
      response.sendFile(path.join(__dirname, "/static/game_one/game.html"));
      break;
    case "shogi":
      response.sendFile(path.join(__dirname, "/static/shogi/game.html"));
      break;
    default:
      response.send({ message: "No game found with that id" });
  }
});

api.get("/version", function(request, response) {
  response.send({version : packageVersion});
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
    io.sockets.emit("plateauUpdate", board.getBoard());
  });

  socket.on("movePiece", function(move) {
    console.log(`MoveRequest From: {${move.from.x}, ${move.from.y}}`)
    console.log(`MoveRequest To: {${move.to.x}, ${move.to.y}}`)
    board.movePiece(move.from.x, move.from.y, move.to.x, move.to.y);
    io.sockets.emit("plateauUpdate", board.getBoard());
  });
});

//GAME 2
class Piece {
  constructor(x, y, team, pic, promotionPic) {
    this.x = x;
    this.y = y;
    this.taken = false;
    this.team = team;
    this.hasPromotion = promotionPic ? true : false;
    this.isPromoted = false;
    this.pic = pic;
    this.promotionPic = promotionPic;
  }
}

class Lancer extends Piece {
  constructor(x, y, team, pic, promotionPic) {
    super(x, y, team, pic, promotionPic);
    this.name = "lancer";
    this.hasPromotion = true;
    if(team == "black"){
      this.directions = [
        {x: 0, y: 1, infinite: true}
      ]
    }else{
      this.directions = [
        {x: 0, y: -1, infinite: true}
      ]
    }
  }
}

class Knight extends Piece {
  constructor(x, y, team, pic, promotionPic) {
    super(x, y, team, pic, promotionPic);
    this.name = "knight";
    this.hasPromotion = true;
    if(team == "black"){
      this.directions = [
        {x: -1, y: 2},
        {x: 1, y: 2}
      ]
    }else{
      this.directions = [
        {x: -1, y: -2},
        {x: 1, y: -2}
      ]
    }
  }
}

class Silver extends Piece {
  constructor(x, y, team, pic, promotionPic) {
    super(x, y, team, pic, promotionPic);
    this.name = "silver";
    this.hasPromotion = true;
    if(team == "black"){
      this.directions = [
        {x: -1, y: 1},
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: -1, y: -1},
        {x: 1, y: -1}
      ]
    }else{
      this.directions = [
        {x: -1, y: -1},
        {x: 0, y: -1},
        {x: 1, y: -1},
        {x: -1, y: 1},
        {x: 1, y: 1}
      ]
    }
  }
}

class Gold extends Piece {
  constructor(x, y, team, pic, promotionPic) {
    super(x, y, team, pic, promotionPic);
    this.name = "gold";
    if(team == "black"){
      this.directions = [
        {x: -1, y: 1},
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: -1, y: 0},
        {x: 1, y: 0},
        {x: 0, y: -1}
      ]
    }else{
      this.directions = [
        {x: -1, y: -1},
        {x: 0, y: -1},
        {x: 1, y: -1},
        {x: -1, y: 0},
        {x: 1, y: 0},
        {x: 0, y: 1}
      ]
    }
  }
}

class Bishop extends Piece {
  constructor(x, y, team, pic, promotionPic) {
    super(x, y, team, pic, promotionPic);
    this.name = "bishop";
    this.hasPromotion = true;
    this.directions = [
      {x: -1, y: 1, infinite: true},
      {x: 1, y: 1, infinite: true},
      {x: -1, y: -1, infinite: true},
      {x: 1, y: -1, infinite: true},
    ]
  }
}

class Rook extends Piece {
  constructor(x, y, team, pic, promotionPic) {
    super(x, y, team, pic, promotionPic);
    this.name = "rook";
    this.hasPromotion = true;
    this.directions = [
      {x: 0, y: -1, infinite: true},
      {x: 0, y: 1, infinite: true},
      {x: -1, y: 0, infinite: true},
      {x: 1, y: 0, infinite: true},
    ]
    this.directions_up = [
      {x: 0, y: -1, infinite: true},
      {x: 0, y: 1, infinite: true},
      {x: -1, y: 0, infinite: true},
      {x: 1, y: 0, infinite: true},
      {x: -1, y: -1},
      {x: 1, y: -1},
      {x: -1, y: 1},
      {x: 1, y: 1},
    ]
  }
}

class Pawn extends Piece {
  constructor(x, y, team, pic, promotionPic) {
    super(x, y, team, pic, promotionPic);
    this.name = "pawn";
    this.hasPromotion = true;
    if(team == "black"){
      this.directions = [
        {x: 0, y: 1}
      ]
    }else{
      this.directions = [
        {x: 0, y: -1}
      ]
    }
  }
}

class King extends Piece {
  constructor(x, y, team, pic, promotionPic) {
    super(x, y, team, pic, promotionPic);
    this.name = "king";
    this.directions = [
      {x: -1, y: -1},
      {x: 0, y: -1},
      {x: 1, y: -1},
      {x: -1, y: 0},
      {x: 1, y: 0},
      {x: -1, y: 1},
      {x: 0, y: 1},
      {x: 1, y: 1},
    ]
  }
}

class Board {
  //plateau contains a 2 dimension array of pieces
  constructor() {
    this.plateau = [];
    this.reset();
    this.setupPieces();
  }

  reset() {
    this.plateau = [];
    for (let i = 0; i < 9; i++) {
      let colonne = [];
      for (let j = 0; j < 9; j++) {
        colonne.push({});
      }
      this.plateau.push(colonne);
    }
  }

  setupPieces() {
    let team = "black";
    this.plateau[0][0] = new Lancer(0, 0, team);
    this.plateau[1][0] = new Knight(1, 0, team);
    this.plateau[2][0] = new Silver(2, 0, team);
    this.plateau[3][0] = new Gold(3, 0, team);
    this.plateau[4][0] = new King(4, 0, team);
    this.plateau[5][0] = new Gold(5, 0, team);
    this.plateau[6][0] = new Silver(6, 0, team);
    this.plateau[7][0] = new Knight(7, 0, team);
    this.plateau[8][0] = new Lancer(8, 0, team);

    this.plateau[7][1] = new Bishop(7, 1, team);
    this.plateau[1][1] = new Rook(1, 1, team);

    this.plateau[0][2] = new Pawn(0, 2, team);
    this.plateau[1][2] = new Pawn(1, 2, team);
    this.plateau[2][2] = new Pawn(2, 2, team);
    this.plateau[3][2] = new Pawn(3, 2, team);
    this.plateau[4][2] = new Pawn(4, 2, team);
    this.plateau[5][2] = new Pawn(5, 2, team);
    this.plateau[6][2] = new Pawn(6, 2, team);
    this.plateau[7][2] = new Pawn(7, 2, team);
    this.plateau[8][2] = new Pawn(8, 2, team);

    team = "white";
    this.plateau[0][8] = new Lancer(0, 8, team);
    this.plateau[1][8] = new Knight(1, 8, team);
    this.plateau[2][8] = new Silver(2, 8, team);
    this.plateau[3][8] = new Gold(3, 8, team);
    this.plateau[4][8] = new King(4, 8, team);
    this.plateau[5][8] = new Gold(5, 8, team);
    this.plateau[6][8] = new Silver(6, 8, team);
    this.plateau[7][8] = new Knight(7, 8, team);
    this.plateau[8][8] = new Lancer(8, 8, team);

    this.plateau[1][7] = new Bishop(1, 7, team);
    this.plateau[7][7] = new Rook(7, 7, team);

    this.plateau[0][6] = new Pawn(0, 6, team);
    this.plateau[1][6] = new Pawn(1, 6, team);
    this.plateau[2][6] = new Pawn(2, 6, team);
    this.plateau[3][6] = new Pawn(3, 6, team);
    this.plateau[4][6] = new Pawn(4, 6, team);
    this.plateau[5][6] = new Pawn(5, 6, team);
    this.plateau[6][6] = new Pawn(6, 6, team);
    this.plateau[7][6] = new Pawn(7, 6, team);
    this.plateau[8][6] = new Pawn(8, 6, team);
  }

  getPieceAt(x, y) {
    return this.plateau[x][y];
  }

  getBoard() {
    return this.plateau;
  }

  movePiece(fromX, fromY, toX, toY) {
    if(insideBoundaries({x: fromX, y: toX}) && insideBoundaries({x: toX, y: toY})){
      console.log(
        `Moved from {x:${fromX}, y: ${fromY}} to {x:${toX}, y: ${toY}}`
      );
      let ancienPiece = this.getPieceAt(fromX, fromY);
      ancienPiece.x = toX;
      ancienPiece.y = toY;
      this.plateau[fromX][fromY] = {};
      this.plateau[toX][toY] = ancienPiece;
    } else {
      console.error("Trying to change a piece that is out of boundaries");
    }
  }
}

var board = new Board();

setInterval(function() {
  io.sockets.emit("state", clients);
}, 1000 / 60);

function insideBoundaries(pos){
  return pos.x >= 0 && pos.x < 9 && pos.y >= 0 && pos.y < 9;
}
// setInterval(function() {
//   io.sockets.emit('plateauUpdate', plateau);
// }, 1000 / 60);

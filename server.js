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
class Piece{
  constructor(x,y,team,pic,promotionPic){
      this.matrixPosition = {x: x, y: y};
      this.taken = false;
      this.team = team;
      this.hasPromotion = false;
      this.isPromoted = false;
      this.pic = pic;
      this.promotionPic = promotionPic;
  }
}

class Lancer extends Piece {
  constructor(x, y, team, pic, promotionPic){
      super(x,y,team,pic, promotionPic);
      this.letter = "L";
      this.hasPromotion = true;
      // this.pic = new_pieces["lancer"];
      // this.promotionPic = new_pieces["lancer_up"];
  }
}

class Knight extends Piece {
  constructor(x, y, team, pic, promotionPic){
      super(x,y,team,pic, promotionPic);
      this.letter = "Kn";
      this.hasPromotion = true;
      this.pic = pic;
      this.promotionPic = promotionPic;
      this.pic = new_pieces["knight"];
      this.promotionPic = new_pieces["knight_up"];
  }
}

class Silver extends Piece {
  constructor(x, y, team, pic, promotionPic){
      super(x,y,team,pic, promotionPic);
      this.letter = "S";
      this.hasPromotion = true;
      this.pic = new_pieces["silver"];
      this.promotionPic = new_pieces["silver_up"];
  }
}

class Gold extends Piece {
  constructor(x, y, team, pic, promotionPic){
      super(x,y,team,pic, promotionPic);
      this.letter = "G";
      this.pic = new_pieces["gold"];
  }
}

class Bishop extends Piece {
  constructor(x, y, team, pic, promotionPic){
      super(x,y,team,pic, promotionPic);
      this.letter = "B";
      this.hasPromotion = true;
      this.pic = new_pieces["bishop"];
      this.promotionPic = new_pieces["bishop_up"];
  }
}

class Rook extends Piece {
  constructor(x, y, team, pic, promotionPic){
      super(x,y,team,pic, promotionPic);
      this.letter = "R";
      this.hasPromotion = true;
      this.pic = new_pieces["rook"];
      this.promotionPic = new_pieces["rook_up"];
  }
}

class Pawn extends Piece {
  constructor(x, y, team, pic, promotionPic){
      super(x,y,team,pic, promotionPic);
      this.letter = "P";
      this.hasPromotion = true;
      this.pic = new_pieces["pawn"];
      this.promotionPic = new_pieces["pawn_up"];
  }
}

class King extends Piece {
  constructor(x, y, team, pic, promotionPic){
      super(x,y,team,pic, promotionPic);
      this.letter = "K";
      this.pic = new_pieces["king"];
  }
}

class Board {
  //plateau contains a 2 dimension array of pieces
  constructor(){
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

  setupPieces(){
      let team = "black";
      this.plateau[0][0] = new Lancer(0,0,team);
      this.plateau[1][0] = new Knight(1,0,team);
      this.plateau[2][0] = new Silver(2,0,team);
      this.plateau[3][0] = new Gold(3,0,team);
      this.plateau[4][0] = new King(4,0,team);
      this.plateau[5][0] = new Gold(5,0,team);
      this.plateau[6][0] = new Silver(6,0,team);
      this.plateau[7][0] = new Knight(7,0,team);
      this.plateau[8][0] = new Lancer(8,0,team);
      
      this.plateau[7][1] = new Bishop(7,1,team);
      this.plateau[1][1] = new Rook(1,1,team);

      this.plateau[0][2] = new Pawn(0,2,team);
      this.plateau[1][2] = new Pawn(1,2,team);
      this.plateau[2][2] = new Pawn(2,2,team);
      this.plateau[3][2] = new Pawn(3,2,team);
      this.plateau[4][2] = new Pawn(4,2,team);
      this.plateau[5][2] = new Pawn(5,2,team);
      this.plateau[6][2] = new Pawn(6,2,team);
      this.plateau[7][2] = new Pawn(7,2,team);
      this.plateau[8][2] = new Pawn(8,2,team);

      
      team = "white";
      this.plateau[0][8] = new Lancer(0,8,team);
      this.plateau[1][8] = new Knight(1,8,team);
      this.plateau[2][8] = new Silver(2,8,team);
      this.plateau[3][8] = new Gold(3,8,team);
      this.plateau[4][8] = new King(4,8,team);
      this.plateau[5][8] = new Gold(5,8,team);
      this.plateau[6][8] = new Silver(6,8,team);
      this.plateau[7][8] = new Knight(7,8,team);
      this.plateau[8][8] = new Lancer(8,8,team);
      
      this.plateau[1][7] = new Bishop(1,7,team);
      this.plateau[7][7] = new Rook(7,7,team);

      this.plateau[0][6] = new Pawn(0,6,team);
      this.plateau[1][6] = new Pawn(1,6,team);
      this.plateau[2][6] = new Pawn(2,6,team);
      this.plateau[3][6] = new Pawn(3,6,team);
      this.plateau[4][6] = new Pawn(4,6,team);
      this.plateau[5][6] = new Pawn(5,6,team);
      this.plateau[6][6] = new Pawn(6,6,team);
      this.plateau[7][6] = new Pawn(7,6,team);
      this.plateau[8][6] = new Pawn(8,6,team);
  }

  getPieceAt(x,y){
    return this.plateau[x][y];
  }

  getBoard(){
      return this.plateau;
  }
}

var plateau = new Board();

setInterval(function() {
  io.sockets.emit("state", clients);
}, 1000 / 60);

// setInterval(function() {
//   io.sockets.emit('plateauUpdate', plateau);
// }, 1000 / 60);

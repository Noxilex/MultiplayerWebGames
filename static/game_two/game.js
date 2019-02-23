var socket = io();
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var bg = document.getElementById("bg");

const CASE_SIZE = 70;

var board = new Board();
var selected_case = {};
var availableMoves = [];

canvas.width = 9 * CASE_SIZE;
canvas.height = 9 * CASE_SIZE;
//Preload images
var pieces_nopromo_name = ["gold", "king"];

var pieces_promo_name = [
  "knight",
  "lancer",
  "silver",
  "bishop",
  "pawn",
  "rook"
];
var new_pieces = [];
pieces_nopromo_name.forEach(piece_name => {
  new_pieces[piece_name] = document.getElementsByClassName(piece_name)[0];
});
pieces_promo_name.forEach(piece_name => {
  new_pieces[piece_name] = document.getElementsByClassName(piece_name)[0];
  new_pieces[piece_name + "_up"] = document.getElementsByClassName(
    piece_name + "_up"
  )[0];
});

//EVENTS
canvas.addEventListener("click", function(evt) {
  var mP = getMousePos(canvas, evt);
  var coord = getPosition(mP.x, mP.y);
  let selectedSpot = board.getPieceAt(coord.x, coord.y);
  console.log(selectedSpot)
  if (selected_case.name && isAvailableMove(coord.x, coord.y)) {
    console.log("Is available move")
    console.log(coord)
    socket.emit("movePiece", {
      from: { x: selected_case.x, y: selected_case.y },
      to: { x: coord.x, y: coord.y }
    });
    selected_case = {};
    availableMoves = [];
  } else if(selectedSpot.name){
    selected_case = board.getPieceAt(coord.x, coord.y);
    availableMoves = getAvailableMoves(selected_case);
    console.log(selected_case);
    drawBoard(ctx, board);
  }
});

//SOCKET

//Creates the new player once the pieces have been loaded
socket.emit("new_shogi_player");

socket.on("plateauUpdate", function(plateau) {
  board.updatePlateau(plateau);
  drawBoard(ctx, board);
});

//FUNCTIONS
function setup() {
  createCanvas(9 * CASE_SIZE, 9 * CASE_SIZE);
}

function draw() {
  drawPlateau(ctx, board);
}
/**
 *
 * @param {Canvas Context} ctx
 * @param {Board Object} board
 */
function drawBoard(ctx, board) {
  plateau = board.getBoard();
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      //Draw piece
      let piece = plateau[x][y];
      if (piece.name) drawPiece(piece);
      //Draw square
      ctx.beginPath();
      ctx.strokeStyle = "#AA5500";
      ctx.rect(x * CASE_SIZE, y * CASE_SIZE, CASE_SIZE, CASE_SIZE);
      ctx.stroke();
    }
  }
  if (selected_case.name) {
    ctx.beginPath();
    ctx.strokeStyle = "#00FF00";
    ctx.rect(
      selected_case.x * CASE_SIZE,
      selected_case.y * CASE_SIZE,
      CASE_SIZE,
      CASE_SIZE
    );
    ctx.stroke();
    if (availableMoves.length > 0) {
      console.log(availableMoves);
      ctx.beginPath();
      ctx.strokeStyle = "#0000FF";
      ctx.fillStyle = "#0000FFAA";
      for (let i = 0; i < availableMoves.length; i++) {
        let pos = availableMoves[i];
        ctx.rect(pos.x * CASE_SIZE, pos.y * CASE_SIZE, CASE_SIZE, CASE_SIZE);
        ctx.fillRect(
          pos.x * CASE_SIZE,
          pos.y * CASE_SIZE,
          CASE_SIZE,
          CASE_SIZE
        );
      }
      ctx.stroke();
    }
  }
}

function getPosition(x, y) {
  return { x: Math.floor(x / CASE_SIZE), y: Math.floor(y / CASE_SIZE) };
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function getAvailableMoves(selected_case) {
  //If one of the available moves doesn't have an empty case, don't show it/show it red
  let moves = []
  if (selected_case.directions) {
    selected_case.directions.forEach(direction => {
      let move = {x: selected_case.x + direction.x, y: selected_case.y + direction.y}
      //let piece = board.getPieceAt(move.x, move.y);
      moves.push(move);
    })
  }
  return moves;
}

function drawPiece(piece) {
  ctx.save();
  let pixelPos = { x: piece.x * CASE_SIZE, y: piece.y * CASE_SIZE };

  if (piece.team == "black") {
    ctx.translate(pixelPos.x + CASE_SIZE / 2, pixelPos.y + CASE_SIZE / 2);
    ctx.rotate((180 * Math.PI) / 180);
    ctx.translate(-(pixelPos.x + CASE_SIZE / 2), -(pixelPos.y + CASE_SIZE / 2));
  }
  ctx.drawImage(
    new_pieces[piece.name],
    pixelPos.x,
    pixelPos.y,
    CASE_SIZE,
    CASE_SIZE
  );
  ctx.restore();
}

function isAvailableMove(x, y) {
  let result = false;
  availableMoves.forEach(move => {
    console.log(move);
    console.log({x: x, y:y})
    if (move.x == x && move.y == y){
      result = true;
      return;
    }
  });
  return result;
}

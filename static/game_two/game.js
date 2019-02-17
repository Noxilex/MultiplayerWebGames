var socket = io();
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var background = document.getElementById("bg");

const CASE_SIZE = 70;

var plateau = [];
var selected_case;
var availableMoves = [];

canvas.width = 9 * CASE_SIZE;
canvas.height = 9 * CASE_SIZE;
//Preload images
var pieces_nopromo_name = [
  "gold",
  "king"
];

var pieces_promo_name = [
  "knight",  
  "lancer",
  "silver",
  "bishop",
  "pawn",
  "rook"
]
var new_pieces = [];
pieces_nopromo_name.forEach(piece_name => {
  new_pieces[piece_name] = document.getElementsByClassName(piece_name)[0];
});
pieces_promo_name.forEach(piece_name => {
  new_pieces[piece_name] = document.getElementsByClassName(piece_name)[0];
  new_pieces[piece_name + "_up"] = document.getElementsByClassName(piece_name + "_up")[0];
})

//EVENTS
canvas.addEventListener("click", function(evt) {
  var mP = getMousePos(canvas, evt);
  var coord = getPosition(mP.x, mP.y);
  selected_case = plateau[coord.column][coord.row];
  availableMoves = getAvailableMoves(selected_case);
  console.log(selected_case);
  drawPlateau(ctx, plateau);
});

//SOCKET

//Creates the new player once the pieces have been loaded
socket.emit("new_shogi_player");

socket.on("plateauUpdate", function(plateau) {
  plateau = plateau;
  drawPlateau(ctx, plateau);
});

//FUNCTIONS

function drawPlateau(ctx, plateau) {
  plateau = new Board().getBoard();
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      //Draw piece
      let piece = plateau[x][y].content;
      //If a team is black, it's image should be turned upside down
      ctx.save()
      if(piece.team == "black"){
        ctx.translate(
          x * CASE_SIZE+CASE_SIZE/2,
          y * CASE_SIZE+CASE_SIZE/2)
        ctx.rotate(180 * Math.PI/180);
        ctx.translate(
          - (x * CASE_SIZE+CASE_SIZE/2),
          - (y * CASE_SIZE+CASE_SIZE/2))
      }
      if (piece.name) {
        if (new_pieces[piece.name]) {
          ctx.drawImage(
            new_pieces[piece.name],
            x * CASE_SIZE,
            y * CASE_SIZE,
            CASE_SIZE,
            CASE_SIZE
          );
        } else {
          ctx.font = "15px Arial";
          ctx.fillStyle = "black";
          ctx.fillText(
            piece.name,
            x * CASE_SIZE + CASE_SIZE / 4,
            y * CASE_SIZE + CASE_SIZE / 2
          );
        }
      }
      ctx.restore();
      //Draw square
      ctx.beginPath();
      ctx.strokeStyle = "#AA5500";
      ctx.rect(x * CASE_SIZE, y * CASE_SIZE, CASE_SIZE, CASE_SIZE);
      ctx.stroke();
    }
  }
  if (selected_case) {
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
  return { column: Math.floor(x / CASE_SIZE), row: Math.floor(y / CASE_SIZE) };
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
  if(selected_case.content.name){
    return [{ x: selected_case.x, y: selected_case.y - 1 }];
  }else{
    return [];
  }
}

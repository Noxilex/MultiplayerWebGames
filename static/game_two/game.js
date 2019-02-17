var socket = io();
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var background = document.getElementById("img");

const CASE_SIZE = 70;

var plateau_player = [];
var selected_case;
var availableMoves = [];

canvas.width = 9 * CASE_SIZE;
canvas.height = 9 * CASE_SIZE;

//EVENTS
canvas.addEventListener("click", function(evt) {
  var mP = getMousePos(canvas, evt);
  var coord = getPosition(mP.x, mP.y);
  selected_case = plateau_player[coord.column][coord.row];
  availableMoves = getAvailableMoves(selected_case);
  console.log(selected_case);
  drawPlateau(ctx, plateau_player);
});

//SOCKET
socket.emit("new_shogi_player");

socket.on("plateauUpdate", function(plateau) {
  plateau_player = plateau;
  drawPlateau(ctx, plateau);
});

//FUNCTIONS

function drawPlateau(ctx, plateau) {
  // ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      //Draw piece
      let piece = plateau[x][y].content;
      if (piece.name) {
        ctx.font = "15px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(
          plateau[x][y].content.name,
          x * CASE_SIZE + CASE_SIZE / 4,
          y * CASE_SIZE + CASE_SIZE / 2
        );
      }
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
      console.log(availableMoves)
      ctx.beginPath();
      ctx.strokeStyle = "#0000FF";
      ctx.fillStyle = "#0000FFAA";
      for (let i = 0; i < availableMoves.length; i++) {
        let pos = availableMoves[i];
        ctx.rect(
          pos.x * CASE_SIZE,
          pos.y * CASE_SIZE,
          CASE_SIZE,
          CASE_SIZE
        );
        ctx.fillRect(pos.x * CASE_SIZE,
          pos.y * CASE_SIZE,
          CASE_SIZE,
          CASE_SIZE)
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
  return [{ x: selected_case.x, y: selected_case.y - 1 }];
}

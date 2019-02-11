var socket = io();
var movement = {
    up: false,
    down: false,
    left: false,
    right: false
  }
  document.addEventListener('keydown', function(event) {
      console.log(event.keyCode);
    switch (event.keyCode) {
      case 37: // A
        movement.left = true;
        break;
      case 38: // W
        movement.up = true;
        break;
      case 39: // D
        movement.right = true;
        break;
      case 40: // S
        movement.down = true;
        break;
    }
  });
  document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
      case 37: // A
        movement.left = false;
        break;
      case 38: // W
        movement.up = false;
        break;
      case 39: // D
        movement.right = false;
        break;
      case 40: // S
        movement.down = false;
        break;
    }
  });

socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
    context.clearRect(0, 0, 800, 600);
    for (var id in players) {
      var player = players[id];
      context.fillStyle = player.color;
      context.beginPath();
      context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
      context.fill();
    }
  });
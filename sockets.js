var socketIO = require('socket.io');
var server = require('./server')
var io = socketIO(server);
io.on('connection', function(socket) {
    socket.on('new player', function() {
      players[socket.id] = {
        x: 300,
        y: 300,
        color: `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}`
      };
    });
    socket.on('movement', function(data) {
      var player = players[socket.id] || {};
      if (data.left) {
        player.x -= 5;
      }
      if (data.up) {
        player.y -= 5;
      }
      if (data.right) {
        player.x += 5;
      }
      if (data.down) {
        player.y += 5;
      }
    });
  });
// Add the WebSocket handlers
var players = {};


setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);

  module.exports = io;
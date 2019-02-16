// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var api = require('./api');
var server = http.Server(api);
var io = socketIO(server);


// Starts the server.
server.listen(5000, '0.0.0.0', function() {
  console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
var players = {};
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

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
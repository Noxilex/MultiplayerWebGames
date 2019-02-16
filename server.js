// Dependencies
var http = require('http');
var io = require('./sockets')
var app = require('./api')
var server = http.Server(app);
// Starts the server.
server.listen(5000, '0.0.0.0', function() {
  console.log('Starting server on port 5000');
});

module.exports = server;
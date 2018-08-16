const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
// Earlier we were running server using app.listen
// Now we have to incorporate socket.io with oor web Server
// This can be done as follows
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

// app.user(express.static(__dirname + '/../public'))
// OR
app.use(express.static(publicPath));

// Here express uses a build-in http module to create a web server
// Here app.listen means http.createServer internally
server.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});

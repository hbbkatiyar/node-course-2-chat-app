const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app); /* Earlier we were running server using app.listen. Now we have to incorporate socket.io with oor web Server. This can be done as follows */
var io = socketIO(server);
app.use(express.static(publicPath)); // app.user(express.static(__dirname + '/../public'))

io.on('connection', (socket) => {
  console.log('New user connected');

  // First argument is event name & second one is data
  // socket.emit "emits" to a single connection
  /* socket.emit('newMessage', {
    from: 'ansh.katiyar@example.com',
    text: 'Hey. How r u?',
    createAt: new Date().getTime()
  }); */

  socket.on('createMessage', (message) => {
    console.log('Create Message', message);
    // io.emit "emits" to every connected connection
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

/* Here express uses a build-in http module to create a web server. Here app.listen means http.createServer internally */
server.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});

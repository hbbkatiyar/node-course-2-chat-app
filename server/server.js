const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();

/* Earlier we were running server using app.listen.
  Now we have to incorporate socket.io with oor web Server.
  This can be done as follows */
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

// app.user(express.static(__dirname + '/../public'))
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    console.log(message);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text, message.color));
    }

    callback();
  });

  socket.on('createLocationMesage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`, '#FF0000'));
    }
  });
});

/* Here express uses a build-in http module to create a web server.
  Here app.listen means http.createServer internally */
server.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});


// NOTE:
//   socket.emit "emits" to a single connection
//   io.emit "emits" to every connected connection
//   socket.broadcast.emit "emits" to very specific user
//   Event acknowledge

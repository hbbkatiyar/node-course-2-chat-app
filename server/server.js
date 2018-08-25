const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();

/* Earlier we were running server using app.listen.
  Now we have to incorporate socket.io with oor web Server.
  This can be done as follows */
var server = http.createServer(app);
var io = socketIO(server);

// app.user(express.static(__dirname + '/../public'))
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room name are required.');
    }

    socket.join(params.room);
    // socket.leave('The Office fans')

    // io.emit -> io.to('The Office Fans').emit
    // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
    // socket.emit
    
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('Create Message', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMesage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
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

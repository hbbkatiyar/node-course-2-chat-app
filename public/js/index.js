var socket = io();
// This initiate a request from client to server, and this method is accessible here beacause of the above file inclusion

socket.on('connect', function () {
  console.log('Connected to server');
  // First argument is event name & second one is data
  /* socket.emit('createMessage', {
    from: 'palak@example.com',
    text: 'Hey, this is for testing'
  }); */
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(email) {
  console.log('New Message', email);
});

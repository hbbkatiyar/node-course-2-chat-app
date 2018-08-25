var socket = io();
/* This initiate a request from client to server,
  and this method is accessible here beacause of the above file inclusion */

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(email) {
  console.log('New Message', email);
});

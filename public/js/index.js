var socket = io();

socket.on('connect', function () {
  console.log('connected...');

  console.log(socket);
});

socket.on('disconnect', function () {
  console.log('Disconnected from server...');
});

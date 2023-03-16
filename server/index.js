const io = require('socket.io')(3000);


io.on('connection',(socket) => {
   console.log('Connected');
   socket.on('player-enter',(data) => {
    socket.broadcast.emit('player-enter',data);
   });
   socket.on('disconnect',() => {
    socket.broadcast.emit('player-left');
   })
   socket.on('add-first-player',(data) => {
    socket.broadcast.emit('add-first-player',data);
   })
   socket.on('update-player',(data) => {
    socket.broadcast.emit('update-enemy',data);
   })
})
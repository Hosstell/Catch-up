var express = require('express')

// init
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// settings
server.listen(8000);
app.use(express.static('./'));

// router
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


// data
let players = []

// socket
io.on('connection', function (socket) {
  // Генерируем id
  let id

  socket.on('getNewUser', function (user) {
    players.push(user)
    id =  user.id
    io.emit('updateUser', user)
  })

  // Получение других пользователей
  socket.on('getAnotherUsers', function() {
    let anotherUsers = players.filter(player => player.id !== id)
    socket.emit('getAnotherUsers', anotherUsers)
  })

  // Обновление данных пользователя
  socket.on('updateUser', function (user) {
    players = players.filter(player => player.id !== id)
    players.push(user)
    io.emit('updateUser', user)
  })

  socket.on('disconnect', function () {
    players = players.filter(player => player.id !== id)
    io.emit('deleteUser', id)
  })
});







// var express = require('express')
//
//
// // init
// var app = express()
// var server = require('http').Server(app);
// var io = require('socket.io')(server);
//
// // settings
// var port = 8000
// app.use(express.static('./'));
//
//
// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/index.html')
// })
//
// app.listen(port, function () {
//   console.log(`Express server listening on port: ${port}`)
// })
//

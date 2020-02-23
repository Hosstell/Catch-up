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
  let id

  socket.on('login', function (user) {
    console.log('New user connected. id: ' + user.id)

    players.push(user)
    id =  user.id
    io.emit('newUserLogin', user)
  })


  socket.on('sendMyPressedKeyEvent', function (event) {
    // setTimeout(() => {
      io.emit('sendPressedKeyEvent', event)
    // }, 100)
  })

  // Получение других пользователей
  socket.on('getAllUsers', function() {
    let anotherUsers = players.filter(player => player.id !== id)
    socket.emit('getAllUsers', anotherUsers)
  })

  // Обновление данных пользователя
  socket.on('updateUser', function (user) {
    players = players.filter(player => player.id !== id)
    players.push(user)
    io.emit('updateUser', user)
  })

  socket.on('disconnect', function () {
    console.log('User disconnected. id: ' + id)

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

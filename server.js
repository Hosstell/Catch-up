const express = require("express");
const path = require('path');
const http = require('http')
const socketIO = require('socket.io')
const {getCurrentTime} = require('./time')
const {getId} = require('./id')

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.use(express.static('./'))

app.get("/", function(request, response){
  response.sendFile(path.join(__dirname + '/index.html'));
});


let users = {}
let history = {}
let protectCodes = {}
let startRoundTime = null

io.on('connection', function (socket) {
  // console.log('Присоединился новый пользователь', socket.id)

  socket.on('login', function () {
    // console.log(`Пользователь ${socket.id} отправил запрос`)

    if (!startRoundTime) {
      startRoundTime = getCurrentTime()
    }

    let time = getCurrentTime()
    let newUserEvent = {
      id: socket.id,
      x: Math.random() * 100,
      y: Math.random() * 100,
      typeEvent: 'newUser'
    }

    if (time in history) {
      history[time].push(newUserEvent)
    } else {
      history[time] = [newUserEvent]
    }

    socket.emit('login', {
      userId: socket.id,
      history: history,
      startRoundTime: startRoundTime
    })

    io.emit('newUser', {
      time: time,
      event: newUserEvent
    })
  })

  socket.on('disconnect', function () {
    console.log(`Пользователь ${socket.id} отключился`)

    let newEvent = {
      id: socket.id,
      typeEvent: 'userGoOut'
    }



  })


  socket.on('pressButton', function (event) {
    console.log(socket.id, event.time, event.event.button, event.event.status)
    console.log(event)

    if (event.time in history) {
      history[event.time].push(event.event)
    } else {
      history[event.time] = [event.event]
    }

    setTimeout(() => {
      io.emit('pressButton', event)
    }, Math.random() * 300)

    // io.emit('pressButton', event)
  })

  //
  //
  // socket.on('sendMyPressedKeyEvent', function (event) {
  //   // setTimeout(() => {
  //   io.emit('sendPressedKeyEvent', event)
  //   // }, 100)
  // })
  //
  // // Получение других пользователей
  //
  //
  // // Обновление данных пользователя
  // socket.on('updateUser', function (user) {
  //   players = players.filter(player => player.id !== id)
  //   players.push(user)
  //   io.emit('updateUser', user)
  // })
  //

});


// // начинаем прослушивать подключения на 3000 порту
// app.listen(3000);

server.listen(3000, () => {
  console.log('Server is running')
})


// socket

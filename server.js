const express = require("express")
const path = require('path')
const http = require('http')
const socketIO = require('socket.io')
const {getCurrentTime} = require('./time')
const {ips} = require("./ip")


const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3000

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: `http://${HOST}:${PORT}/`,
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
        credentials: true
    },
    allowEIO3: true
});


app.use(express.static('./'))

app.get("/", function(request, response){
  response.sendFile(path.join(__dirname + '/index.html'));
});

let users = {}
let history = {}
let startRoundTime = null
let activeUsers = new Set()

function createNewGame() {
  users = {}
  history = {}
  startRoundTime = getCurrentTime()
}

function finishGame() {
  users = {}
  history = {}
  startRoundTime = null
}


io.on('connection', function (socket) {
  console.log('New user connected! user_id:', socket.id)

  // Вход нового пользователя
  socket.on('login', function (userData) {
    if (!activeUsers.size) {
      createNewGame()
    }

    let time = getCurrentTime()
    let newUserEvent = {
      id: socket.id,
      name: userData.name,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: generateColor(),
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

    activeUsers.add(socket.id)
  })

  // Отключение пользователя
  socket.on('disconnect', function () {
    console.log('User disconnected! user_id:', socket.id)

    activeUsers.delete(socket.id)
    if (!activeUsers.size) {
      finishGame()
      return
    }

    let time = getCurrentTime()
    let event = {
      userId: socket.id,
      typeEvent: 'disconnect'
    }

    if (time in history) {
      history[time].push(event)
    } else {
      history[time] = [event]
    }

    io.emit('disconnect_', {
      time: time,
      event: event
    })
  })

  // Нажатие кнопок
  socket.on('pressButton', function (event) {
    if (event.time in history) {
      history[event.time].push(event.event)
    } else {
      history[event.time] = [event.event]
    }
    io.emit('pressButton', event)
  })


  // Изменение имени
  socket.on('changeName', function (data) {

    let time = getCurrentTime()
    let event = {
      userId: socket.id,
      name: data.name,
      typeEvent: 'changeName'
    }

    if (time in history) {
      history[time].push(event)
    } else {
      history[time] = [event]
    }

    io.emit('changeName', {
      time: time,
      event: event
    })
  })

  socket.on('changeColor', function (data) {

    let time = getCurrentTime()
    let event = {
      userId: socket.id,
      color: data.color,
      typeEvent: 'changeColor'
    }

    if (time in history) {
      history[time].push(event)
    } else {
      history[time] = [event]
    }

    io.emit('changeColor', {
      time: time,
      event: event
    })
  })
});


function generateColor() {
  let r = Math.floor(Math.random() * 255).toString(16)
  let g = Math.floor(Math.random() * 255).toString(16)
  let b = Math.floor(Math.random() * 255).toString(16)

  r = r.length === 1 ? '0' + r : r
  g = g.length === 1 ? '0' + g : g
  b = b.length === 1 ? '0' + b : b

  return `#${r}${g}${b}`
}

server.listen(PORT, HOST, () => {
  console.log('Server is running!\n')

  console.log(`Local host: http://${HOST}:${PORT}/`)
  for (const key in ips) {
    console.log(`${key}: http://${ips[key]}:${PORT}/`)
  }
})

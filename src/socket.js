import settings from "./settings.js";

export class Socket {
  constructor() {
    this.socket = io.connect('http://localhost:3000')
  }

  connect(game) {
    this.socket.on('login', (data) => {
      console.log('Получен запрос: login')
      console.log(data)

      settings.myId = data.userId

      game.history = data.history
      game.startTimePoint = data.startRoundTime
      game.currentTime = data.startRoundTime - 2000
      game.history_users = {}
    })

    this.socket.on('newUser', (data) => {
      if (data.event.id !== settings.myId) {
        game.addEvent(data.time, data.event)
      }
    })

    this.socket.on('pressButton', (event) => {
      game.addEvent(event.time, event.event)
    })

    this.socket.on('disconnect', event => {
      game.addEvent(event.time, event.event)
    })

    this.socket.emit('login')
    console.log('Отправлен запрос: login')
  }

  sendPressButtonEvent(event) {
    this.socket.emit('pressButton', event)
  }
}
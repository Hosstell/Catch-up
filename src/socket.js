import settings from "./settings.js";
import {defineStartHandler, getNameUser, setChangeNameHandler, setChangeColorHandler, getUserColor} from './userPanel.js'

export class Socket {
  constructor() {
    this.socket = io.connect(settings.serverHost)

    this.connectStatus = false
    this.loopFunction = null

    defineStartHandler(() => {
      if (this.connectStatus) {
        return
      }

      let name = getNameUser()
      if (name) {
        this.socket.emit('login', {
          name: name
        })
        this.connectStatus = true
        // setInterval(this.loopFunction, 10)
      } else {
        alert("Your name is not definite. Enter your name to the 'Your name' field")
      }
    })

    setChangeNameHandler(() => {
      if (!this.connectStatus) {
        return
      }

      let name = getNameUser()
      if (name) {
        this.socket.emit('changeName', {
          name: name,
        })
      } else {
        alert("'Your name' field is empty!")
      }
    })

    setChangeColorHandler(() => {
      if (!this.connectStatus) {
        return
      }

      let color = getUserColor()
      this.socket.emit('changeColor', {
        color: color,
      })
    })
  }

  connect(game) {
    this.socket.on('login', (data) => {
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

    this.socket.on('disconnect_', event => {
      game.addEvent(event.time, event.event)
    })


    this.socket.on('changeName', (event) => {
      game.addEvent(event.time, event.event)
    })

    this.socket.on('changeColor', (event) => {
      console.log(event)
      game.addEvent(event.time, event.event)
    })
  }

  sendPressButtonEvent(event) {
    this.socket.emit('pressButton', event)
  }

  setLoopFunction(loopFunction) {
    this.loopFunction = loopFunction
  }
}
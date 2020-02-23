import {UserBall} from './balls.mjs'
import {createUserObjectByObject} from "./balls.mjs";
import {getCurrentTime} from "./time.mjs";


export default class SocketServer{
  constructor(io) {
    this.io = io
  }

  bindGameLogic(gameLogic) {

    this.io.on('connection', (socket) => {
      let id

      socket.on('login', (user) => {
        console.log('New user connected. id: ' + user.id)
        gameLogic.game.addEnemy(user)
        id =  user.id
        this.io.emit('newUserLogin', user)
        setTimeout(() => {
          this.io.emit('setActiveUser', user.id)
        }, 100)
        socket.emit('login', gameLogic.game)
      })

      socket.on('disconnect', () => {
        gameLogic.deleteUser(id)

        if (gameLogic.game.enemies.length) {
          this.io.emit('setActiveUser', gameLogic.game.enemies[0].id)
        }

        if (id) {
          this.io.emit('deleteUser', id)
        }
      })

      socket.on('sendMyPressedKeyEvent', (event) => {
        if (!gameLogic.game.enemies.map(enemy => enemy.id).includes(event.id)) return

        this.io.emit('sendPressedKeyEvent', event)
        gameLogic.addEvent(event)
      })

      socket.on('updateMyData', (user) => {
        gameLogic.game.addEnemy(user)
        this.io.emit('updateMyData', user)
      })

    })
  }
}
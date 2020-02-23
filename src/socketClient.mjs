import {UserBall} from './balls.mjs'
import {createUserObjectByObject} from "./balls.mjs";
import {getCurrentTime} from "./time.mjs";

export default class SocketClient{
  constructor(html) {
    this.socket = io.connect('http://localhost:8000')
    this.html = html
  }

  bindGameLogic(gameLogic) {
    this.gameLogic = gameLogic

    // Получение состояние игры
    this.socket.on('login', (game) => {
      console.log('Пришли данные с сервера', game)
      this.gameLogic.changeGame(game)
      this.html.setPlayersList([
        this.gameLogic.game.user,
        ...this.gameLogic.game.enemies
      ])
    })

    // Получение всех игроков
    this.socket.on('getAllUsers', (anotherUsers) => {
      console.log('getAllUsers', anotherUsers)
      anotherUsers.forEach(user => {
        this.gameLogic.game.enemies.push(createUserObjectByObject(user))
      })
      this.html.setPlayersList([
        this.gameLogic.game.user,
        ...this.gameLogic.game.enemies
      ])
    })


    this.gameLogic.game.user.pressedKeyAction = (pressedKeys) => {
      let event = {
        id: this.gameLogic.game.user.id,
        time: getCurrentTime(),
        pressedKeys: pressedKeys
      }

      this.socket.emit('sendMyPressedKeyEvent', event)
      this.gameLogic.events.push(event)
    }

    this.gameLogic.game.user.updateMyData = () => {
      this.socket.emit('updateMyData', this.gameLogic.game.user)
    }
    this.socket.on('updateMyData', (user) => {
      if (this.gameLogic.game.user.id !== user.id) {
        let enemy = this.gameLogic.game.enemies.find(enemy => enemy.id === user.id)
        enemy.name = user.name
        enemy.color = user.color
      }
      this.html.setPlayersList([
        this.gameLogic.game.user,
        ...this.gameLogic.game.enemies
      ])
    })

    this.socket.on('sendPressedKeyEvent', (event) => {
      if (this.gameLogic.game.user.id !== event.id) {
        setTimeout(() => {
          this.gameLogic.addEvent(event)
        }, 0)
      }
    })

    this.socket.on('newUserLogin', (newUserLogin) => {
      // TODO Не возвращать собственные данные!
      this.gameLogic.addNewUser(newUserLogin)
      this.html.setPlayersList([
        this.gameLogic.game.user,
        ...this.gameLogic.game.enemies
      ])
    })

    this.socket.on('setActiveUser', (userId) => {
      this.gameLogic.setActiveUser(userId)
    })

    this.socket.on('deleteUser', (userId) => {
      this.gameLogic.deleteUser(userId)
      this.html.setPlayersList([
        this.gameLogic.game.user,
        ...this.gameLogic.game.enemies
      ])
    })
  }

  connect() {
    this.socket.emit('login', this.gameLogic.game.user)
    this.socket.emit('getAllUsers')
  }
}
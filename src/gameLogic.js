import settings from "./settings.js";
import {createUserObjectByObject} from "./balls.js";
import {getCurrentTime} from "./time.js";

export class GameLogicClient {
  constructor(game, ctx, pressedKeys) {
    this.game = game
    this.ctx = ctx
    this.pressedKeys = pressedKeys
    this.lastTickTime = getCurrentTime()
    this.maxFrames = 100
    this.frames = []
    this.events = []

    let socket = io.connect('http://188.233.50.109')
    socket.emit('login', game.user)
    socket.emit('getAllUsers')
    socket.on('getAllUsers', (anotherUsers) => {
      // debugger
      anotherUsers.forEach(user => {
        console.log(user)
        // game.enemies.push(createUserObjectByObject(user))
      })
    })


    this.game.user.pressedKeyAction = (pressedKeys) => {
      let event = {
        id: this.game.user.id,
        time: getCurrentTime(),
        pressedKeys: pressedKeys
      }
      socket.emit('sendMyPressedKeyEvent', event)
      this.events.push(event)
    }

    socket.on('sendPressedKeyEvent', (event) => {
      if (this.game.user.id !== event.id) {
        // console.log('Получены данные нажатия кнопки', event.pressedKeys, event.time)

        this.events.push(event)

        // debugger
        let frame = _.find(this.frames, frame => frame.time === event.time)
        if (frame) {
          // debugger
          // console.log('Время изменено', this.lastTickTime, event.time)

          this.game = frame.game
          this.lastTickTime = event.time
          this.frames = this.frames.filter(frame => frame.time < event.time)


        }
      }
    })

    socket.on('newUserLogin', (newUserLogin) => {
      // TODO Не возвращать собственные данные!
      if (newUserLogin.id !== this.game.user.id) {
        game.enemies = game.enemies.filter(enemy => enemy.id !== anotherUser.id)
        game.enemies.push(createUserObjectByObject(newUserLogin))
      }
    })

    // // Отправление собственных данных
    // this.gameData.socket.emit('getNewUser', user)
    //
    // // Получение данных о других игроках
    // this.gameData.socket.emit('getAnotherUsers')

    //
    // // Обновление данных о пользователе
    // this.gameData.socket.on('updateUser', function (anotherUser) {
    //   // TODO Не возвращать собственные данные!
    //   if (anotherUser.id !== user.id) {
    //     gameData.enemies = gameData.enemies.filter(enemy => enemy.id !== anotherUser.id)
    //     gameData.enemies.push(createUserObjectByObject(anotherUser))
    //   }
    // })
    //

    // Удаление вышедшего пользователя
    socket.on('deleteUser', function (id) {
      game.enemies = game.enemies.filter(enemy => enemy.id !== id)
    })
  }

  nextStep() {
    let currentTickTime = getCurrentTime()
    if (currentTickTime === this.lastTickTime) return false

    let events = this.events.filter(event => event.time === this.lastTickTime)
    // console.log('Расчет события №', this.lastTickTime, events)
    let users = [this.game.user, ...this.game.enemies]

    events.forEach(event => {
      users.forEach(user => {
        if (event.id === user.id) {
          // console.log('Применено событие', this.lastTickTime, event.pressedKeys)
          user.lastPressedKeys = event.pressedKeys
        }
      })
    })

    this.game.step()
    this.lastTickTime++
    this.frames.push({
      time: this.lastTickTime,
      game: this.game.getCopy(),
    })

    // console.log(this.lastTickTime)
    // console.log('user', this.game.user.x, this.game.user.y)
    if (this.game.enemies.length) {
      // console.log('enemy', this.game.enemies[0].x, this.game.enemies[0].y)
    }

    // if (this.frames.length > this.maxFrames) {
    //   let needlessCount = this.frames.length - this.maxFrames
    //   this.frames.splice(0, needlessCount)
    // }

    return true
  }

  loop() {
    while (this.nextStep()) {}
    this.game.render(this.ctx)
  }
}
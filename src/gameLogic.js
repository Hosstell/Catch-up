import settings from "./settings.js";
import {createUserObjectByObject} from "./balls.js";

export class GameLogicClient {
  constructor(game, ctx, pressedKeys) {
    this.game = game
    this.ctx = ctx
    this.pressedKeys = pressedKeys
    // this.socket = io.connect('http://188.233.50.109')

    this.lastTickTime = Math.trunc(performance.now() / settings.tickTime)

    this.maxFrames = 100
    this.frames = []


    // // Отправление собственных данных
    // this.gameData.socket.emit('getNewUser', user)
    //
    // // Получение данных о других игроках
    // this.gameData.socket.emit('getAnotherUsers')
    // this.gameData.socket.on('getAnotherUsers', function (anotherUsers) {
    //   anotherUsers.forEach(user => {
    //     gameData.enemies.push(createUserObjectByObject(user))
    //   })
    // })
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
    // // Удаление вышедшего пользователя
    // this.gameData.socket.on('deleteUser', function (id) {
    //   gameData.enemies = gameData.enemies.filter(enemy => enemy.id !== id)
    // })
  }

  nextStep() {
    let currentTickTime = this.getCurrentTickTime()
    if (currentTickTime === this.lastTickTime) return false

    this.lastTickTime++
    this.game.step()
    this.frames.push({
      timeTick: currentTickTime,
      game: this.game.getCopy(),
    })

    if (this.frames.length > this.maxFrames) {
      let needlessCount = this.frames.length - this.maxFrames
      this.frames.splice(0, needlessCount)
    }

    return true
  }

  loop() {
    while (this.nextStep()) {}
    this.game.render(this.ctx)
  }

  getCurrentTickTime() {
    return Math.trunc(performance.now() / settings.tickTime)
  }
}
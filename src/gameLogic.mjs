import settings from "./settings.mjs";
import {createUserObjectByObject} from "./balls.mjs";
import {getCurrentTime} from "./time.mjs";

export class GameLogicClient {
  constructor(game, ctx) {
    this.game = game
    this.ctx = ctx
    this.lastTickTime = getCurrentTime()
    this.maxFrames = 100
    this.frames = []
    this.events = []
  }

  nextStep() {
    let currentTickTime = getCurrentTime()
    if (currentTickTime === this.lastTickTime) return false

    let events = this.events.filter(event => event.time === this.lastTickTime)
    // console.log('Расчет события №', this.lastTickTime, this.game.user && this.game.user.lastPressedKeys)
    let users = this.game.getAllUsers()

    events.forEach(event => {
      users.forEach(user => {
        if (event.id === user.id) {
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
    // if (this.game.enemies.length) {
    //   console.log('enemy', this.game.enemies[0].x, this.game.enemies[0].y)
    // }
    // if (this.game.user) {
    //   console.log('enemy', this.game.user.x, this.game.user.y)
    // }

    // if (this.frames.length > this.maxFrames) {
    //   let needlessCount = this.frames.length - this.maxFrames
    //   this.frames.splice(0, needlessCount)
    // }

    return true
  }

  calculateLogicBeforeNow() {
    while (this.nextStep()) {}
  }

  loop() {
    this.calculateLogicBeforeNow()
    this.game.render(this.ctx)
  }

  addEvent(event) {
    this.events.push(event)

    let frame = this.frames.find(frame => frame.time === event.time)
    if (frame) {
      this.game = frame.game
      this.lastTickTime = event.time
      this.frames = this.frames.filter(frame => frame.time < event.time)
    }
    this.calculateLogicBeforeNow()
  }

  addNewUser(newUser) {
    if (newUser.id !== this.game.user.id) {
      this.game.enemies = this.game.enemies.filter(enemy => enemy.id !== newUser.id)
      this.game.enemies.push(createUserObjectByObject(newUser))
    }
  }

  deleteUser(userId) {
    this.game.enemies = this.game.enemies.filter(enemy => enemy.id !== userId)
  }

  changeGame(newGame) {
    console.log('Список игроков')
    newGame.enemies.forEach(enemy => {
      console.log(enemy)
      this.addNewUser(enemy)
    })
  }

  setActiveUser(userId) {
    if (this.game.user.id === userId) {
      this.game.user.active = true
      this.game.enemies.forEach(enemy => enemy.active = false)
    } else {
      this.game.user.active = false
      let enemy = this.game.enemies.find(enemy => enemy.id === userId)
      if (enemy) enemy.active = true
    }
  }
}

export class GameLogicServer extends GameLogicClient{
  loop() {
    this.calculateLogicBeforeNow()
  }
}
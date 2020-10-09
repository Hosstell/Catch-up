import settings from "./settings.js"
import {getCurrentTime} from './common/time.js'
import {User} from "./common/user.js";

export class Game {
  constructor(walls, startTimePoint) {
    this.startTimePoint = startTimePoint
    this.currentTime = startTimePoint
    this.users = []
    this.walls = walls
    this.history = {}
    this.history_users = {}

    this.times = []
    this.count = 0
    this.hashCode = function(s){
      return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    }
    // this.delete = 0
    //
    // setTimeout(() => {
    //   this.delete = 9000
    //   this.currentTime -= 9000
    //   this.users = this.history_users[this.currentTime]
    // }, 10000)

    // setInterval(() => {
    //   console.log('update')
    //   this.currentTime = this.startTimePoint
    //   this.users = []
    //   this.history_users = {}
    // }, 20000)
  }

  addEvent(time, event) {
    if (time in this.history) {
      this.history[time].push(event)
    } else {
      this.history[time] = [event]
    }
    // this.currentTime = this.startTimePoint

    // console.log(event.userId, time,  time, event.button, event.status)


    if (this.currentTime >= time) {

      let users = _.cloneDeep(this.history_users[time - 10])
      this.users = users
      console.log('time:', this.currentTime, time - 10, _.cloneDeep(this.users))
      this.currentTime = time - 10
    }
  }

  step() {
    while (this.currentTime < getCurrentTime()) {
      // console.log(this.currentTime, getCurrentTime())

      this.step_history()
      this.step_data()

      this.currentTime += 10

      this.history_users[this.currentTime] = _.cloneDeep(this.users)
    }
  }

  step_history() {
    let currentTime = this.currentTime + 10
    if (currentTime in this.history) {
      let u = JSON.stringify(this.users)
      let a = JSON.stringify(_.cloneDeep(this.users))
      console.log('---', this.count, this.hashCode(u), this.hashCode(a))
      this.history[currentTime].forEach(event => {
        console.log(currentTime, event.button, event.status)
        this.handlerEvent(event)
      })
      this.count++

    }
  }

  handlerEvent(event) {
    if (event.typeEvent === 'pushButton') {
      this.handlerEventPressButton(event)
    }

    if (event.typeEvent === 'newUser') {
      this.handlerEventNewUser(event)
    }
  }

  handlerEventPressButton(event) {
    // debugger
    let user = this.users.find(user => user.id === event.userId)
    if (event.status === 'down') {
      user.pressedKeys.add(event.button)
    } else if (event.status === 'up') {
      user.pressedKeys.delete(event.button);
    }
  }

  handlerEventNewUser(event) {
    // console.log(event)
    this.users.push( new User(event.id, event.x, event.y, 30))
  }

  step_data() {
    this.users.forEach(user => {
      user.doStep()
      user.update()

      this.walls.forEach(wall => {
        user.checkNearWall(wall)
      })
    })

    for(let i = 0; i < this.users.length; i++) {
      for(let j = 0; j<i; j++) {
        let playerA = this.users[i]
        let playerB = this.users[j]

        if (playerA.isNear(playerB)) {
          playerA.exchangeVector(playerB)
          playerA.exchangeActive(playerB)
        }
      }
    }
  }

  // getAllUsers() {
  //   return [this.user, ...this.enemies]
  // }
  //
  // step() {
  //   this.manager()
  //   this.update()
  // }
  //
  // update() {
  //   let allUsers = this.getAllUsers()
  //   allUsers.forEach(user => user.update())
  //
  //   // Проверка столновений между игроками
  //   for(let i = 0; i<allUsers.length; i++) {
  //     for(let j = 0; j<i; j++) {
  //       let playerA = allUsers[i]
  //       let playerB = allUsers[j]
  //
  //       if (playerA.isNear(playerB)) {
  //         playerA.exchangeVector(playerB)
  //         playerA.exchangeActive(playerB)
  //       }
  //     }
  //   }
  //
  //   // Проверка столкновений между игроком и стеной
  //   allUsers.forEach(player => {
  //     this.walls.forEach(wall => {
  //       player.checkNearWall(wall)
  //     })
  //   })
  // }
  //

  //

  //

  //
  // getCopy() {
  //   return _.cloneDeep(this)
  // }

  // addEnemy(newEnemy) {
  //   this.enemies = this.enemies.filter(enemy => newEnemy.id !== enemy.id)
  //   this.enemies.push(createUserObjectByObject(newEnemy))
  // }
}

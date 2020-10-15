import settings from "./settings.js"
import {getCurrentTime} from './common/time.js'
import {User} from "./common/user.js";
import {deleteAllUsersOnPanel, setUserList, setUserColor} from './userPanel.js'

export class Game {
  constructor(walls, startTimePoint) {
    this.startTimePoint = startTimePoint
    this.currentTime = startTimePoint
    this.users = []
    this.walls = walls
    this.history = {}
    this.history_users = {}
  }

  addEvent(time, event) {
    if (time in this.history) {
      this.history[time].push(event)
    } else {
      this.history[time] = [event]
    }

    if (this.currentTime >= time) {
      let users = _.cloneDeep(this.history_users[time - 10])
      this.users = users
      this.currentTime = time - 10
    }
  }

  step() {
    while (this.currentTime < getCurrentTime()) {
      this.step_history()
      this.step_data()

      this.currentTime += 10
      this.history_users[this.currentTime] = _.cloneDeep(this.users)
    }
  }

  step_history() {
    let currentTime = this.currentTime + 10
    if (currentTime in this.history) {
      this.history[currentTime].forEach(event => {
        this.handlerEvent(event)
      })
    }
  }

  handlerEvent(event) {
    if (event.typeEvent === 'pushButton') {
      this.handlerEventPressButton(event)
    }

    if (event.typeEvent === 'newUser') {
      this.handlerEventNewUser(event)
      this.updateUsersListPanel()
    }

    if (event.typeEvent === 'disconnect') {
      this.handlerEventDisconnect(event)
      this.updateUsersListPanel()
    }

    if (event.typeEvent === 'changeName') {
      this.handlerEventChangeName(event)
      this.updateUsersListPanel()
    }

    if (event.typeEvent === 'changeColor') {
      this.handlerEventChangeColor(event)
      this.updateUsersListPanel()
    }
  }

  handlerEventPressButton(event) {
    let user = this.users.find(user => user.id === event.userId)
    if (!user) {
      return
    }

    if (event.status === 'down') {
      user.pressedKeys.add(event.button)
    } else if (event.status === 'up') {
      user.pressedKeys.delete(event.button);
    }
  }

  handlerEventNewUser(event) {
    this.users.forEach(user => user.active = false)
    this.users.push( new User(event.id, event.x, event.y, 30, event.color, event.name))

    if (event.id === settings.myId) {
      setUserColor(event.color)
    }
  }

  handlerEventDisconnect(event) {
    this.users = this.users.filter(user => user.id !== event.userId)
    if (this.users.length) {
      this.users[this.users.length - 1].active = true
    }
  }

  handlerEventChangeName(event) {
    let user = this.users.find(user => user.id === event.userId)
    user.name = event.name
  }

  handlerEventChangeColor(event) {
    let user = this.users.find(user => user.id === event.userId)
    user.color = event.color
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

  updateUsersListPanel() {
    deleteAllUsersOnPanel()
    setUserList(this.users)
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

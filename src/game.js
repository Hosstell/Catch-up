import settings from "./settings.js"
import {Point, Wall} from "./wall.js";
import Vector from "./vector.js";
import Socket from './socket.js'
import {AnotherUserBall, cloneAnotherUser} from "./balls.js";

export default class Game {
  constructor(ctx, walls, pressKeys, user, enemies) {

    let gameData = {
      socket: io.connect('http://188.233.50.109'),
      ctx: ctx,
      walls: walls,
      pressKeys: pressKeys,
      user: user,
      enemies: enemies
    }
    this.gameData = gameData

    // Отправление собственных данных
    this.gameData.socket.emit('getNewUser', user)

    // Получение данных о других игроках
    this.gameData.socket.emit('getAnotherUsers')
    this.gameData.socket.on('getAnotherUsers', function (anotherUsers) {
      anotherUsers.forEach(user => {
        gameData.enemies.push(cloneAnotherUser(user))
      })
    })

    // Обновление данных о пользователе
    this.gameData.socket.on('updateUser', function (anotherUser) {
      // TODO Не возвращать собственные данные!
      if (anotherUser.id !== user.id) {
        gameData.enemies = gameData.enemies.filter(enemy => enemy.id !== anotherUser.id)
        gameData.enemies.push(cloneAnotherUser(anotherUser))
      }
    })

    // Удаление вышедшего пользователя
    this.gameData.socket.on('deleteUser', function (id) {
      gameData.enemies = gameData.enemies.filter(enemy => enemy.id !== id)
    })
  }

  gameLoop() {
    this.update()
    this.render()
    this.manager()
  }

  update() {
    this.gameData.user.update()
    this.gameData.enemies.forEach(enemy => enemy.update())


    let allPlayers = [this.gameData.user, ...this.gameData.enemies]
    // Проверка столновений между игроками
    for(let i = 0; i<allPlayers.length; i++) {
      for(let j = 0; j<i; j++) {
        let playerA = allPlayers[i]
        let playerB = allPlayers[j]

        if (playerA.isNear(playerB)) {
          playerA.exchangeVector(playerB)
          playerA.exchangeActive(playerB)
        }
      }
    }

    // Проверка столкновений между игроком и стеной
    allPlayers.forEach(player => {
      this.gameData.walls.forEach(wall => {
        player.checkNearWall(wall)
      })
    })
  }

  render() {
    this.gameData.ctx.clearRect(0, 0, settings.width, settings.height)

    // Враги
    this.gameData.enemies.forEach(enemy => {
      this.gameData.ctx.beginPath()
      enemy.render(this.gameData.ctx)
      this.gameData.ctx.stroke()
    })

    // Закрасить невидемые зоны
    this.renderVisibilityArea(this.gameData.user)

    // Игрок
    this.gameData.user.render(this.gameData.ctx)

    // Дополнительные стены
    this.gameData.walls.forEach(wall => {
      this.gameData.ctx.beginPath()
      wall.render(this.gameData.ctx)
      this.gameData.ctx.stroke()
    })
  }

  renderVisibilityArea(user) {
    let areas = []

    this.gameData.walls.forEach(wall => {
      let a = new Vector(
        wall.a.x - user.x,
        wall.a.y - user.y,
      )

      let b = new Vector(
        wall.b.x - user.x,
        wall.b.y - user.y,
      )

      areas.push([
        a.norm().multiply(12000).plus(user),
        wall.a,
        wall.b,
        b.norm().multiply(12000).plus(user)
      ])
    })

    this.gameData.ctx.fillStyle = '#888'
    areas.forEach(area => {
      this.gameData.ctx.beginPath();
      this.gameData.ctx.moveTo(area[0].x, area[0].y)
      this.gameData.ctx.lineTo(area[1].x, area[1].y)
      this.gameData.ctx.lineTo(area[2].x, area[2].y)
      this.gameData.ctx.lineTo(area[3].x, area[3].y)
      this.gameData.ctx.fill()
    })
  }

  manager() {
    this.gameData.user.manage(this.gameData)

    this.gameData.enemies.forEach(enemy => enemy.manage())
  }
}
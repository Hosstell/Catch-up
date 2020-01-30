import settings from "./settings.js"
import {Point, Wall} from "./wall.js";
import Vector from "./vector.js";
import Socket from './socket.js'
import {UserBall, createUserObjectByObject} from "./balls.js";

export default class Game {
  constructor(user, walls) {
    this.gameData = {
      walls: walls,
      user: user,
      enemies: []
    }
  }

  step() {
    this.manager()
    this.update()
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

  render(ctx) {
    ctx.clearRect(0, 0, settings.width, settings.height)

    // Враги
    this.gameData.enemies.forEach(enemy => {
      ctx.beginPath()
      enemy.render(ctx)
      ctx.stroke()
    })

    // Закрасить невидемые зоны
    this.renderVisibilityArea(this.gameData.user, ctx)

    // Игрок
    this.gameData.user.render(ctx)

    // Дополнительные стены
    this.gameData.walls.forEach(wall => {
      ctx.beginPath()
      wall.render(ctx)
      ctx.stroke()
    })
  }

  renderVisibilityArea(user, ctx) {
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

    ctx.fillStyle = '#888'
    areas.forEach(area => {
      ctx.beginPath();
      ctx.moveTo(area[0].x, area[0].y)
      ctx.lineTo(area[1].x, area[1].y)
      ctx.lineTo(area[2].x, area[2].y)
      ctx.lineTo(area[3].x, area[3].y)
      ctx.fill()
    })
  }

  manager() {
    this.gameData.user.manage()
    this.gameData.enemies.forEach(enemy => enemy.manage())
  }

  getCopy() {
    return _.cloneDeep(this)
  }
}
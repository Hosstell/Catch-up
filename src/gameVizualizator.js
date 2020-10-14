import settings from "./settings.js";
import Vector from './common/vector.js'

export class GameVizualizator {
  constructor(ctx) {
    this.ctx = ctx
  }

  render(game) {
    this.ctx.clearRect(0, 0, settings.width, settings.height)

    // Игроки
    game.users.forEach(user => {
      this.ctx.beginPath()
      this.renderUser(user)
      this.ctx.stroke()
    })

    // Закрасить невидемые зоны
    if (game.users.length) {
      let user = game.users.find(user => user.id === settings.myId)
      this.renderVisibilityArea(game, user)
    }

    // Дополнительные стены
    game.walls.forEach(wall => {
      this.ctx.beginPath()
      this.renderWall(wall)
      this.ctx.stroke()
    })
  }

  renderUser(user) {
    let r = user.size/2
    let x = user.x
    let y = user.y

    this.ctx.fillStyle = user.color
    console.log(user.color, this.ctx.fillStyle)
    this.ctx.beginPath()
    this.ctx.arc(x, y, r, 0,Math.PI*2)
    this.ctx.fill()
    this.ctx.fillStyle = 'black'
    this.ctx.stroke()

    this.ctx.fillStyle = user.active ? 'black': 'white'
    this.ctx.beginPath()
    this.ctx.arc(x, y, r-7, 0,Math.PI*2)
    this.ctx.fill()
    this.ctx.fillStyle = 'black'
    this.ctx.stroke()
  }

  renderWall(wall) {
    this.ctx.beginPath();
    this.ctx.moveTo(wall.a.x, wall.a.y);
    this.ctx.lineTo(wall.b.x, wall.b.y);
    this.ctx.stroke();
  }

  renderVisibilityArea(game, user) {
    let areas = []

    game.walls.forEach(wall => {
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

    this.ctx.fillStyle = '#888'
    areas.forEach(area => {
      this.ctx.beginPath();
      this.ctx.moveTo(area[0].x, area[0].y)
      this.ctx.lineTo(area[1].x, area[1].y)
      this.ctx.lineTo(area[2].x, area[2].y)
      this.ctx.lineTo(area[3].x, area[3].y)
      this.ctx.fill()
    })
  }
}
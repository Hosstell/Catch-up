import settings from "./settings.js"

export default class Game {
  constructor(ctx, pressKeys, users, enemies) {
    this.gameData = {
      ctx: ctx,
      pressKeys: pressKeys,
      users: users,
      enemies: enemies
    }
  }

  gameLoop() {
    this.update()
    this.render()
    this.manager()
  }

  update() {
    this.gameData.users.forEach(user => user.update())
    this.gameData.enemies.forEach(enemy => enemy.update())

    let allPlayers = [...this.gameData.users, ...this.gameData.enemies]
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
  }

  render() {
    this.gameData.ctx.clearRect(0, 0, settings.width, settings.height)

    this.gameData.users.forEach(user => {
      this.gameData.ctx.beginPath()
      user.render(this.gameData.ctx)
    })

    this.gameData.enemies.forEach(enemy => {
      this.gameData.ctx.beginPath()
      enemy.render(this.gameData.ctx)
      this.gameData.ctx.stroke()
    })
  }

  manager() {
    this.gameData.users.forEach(user => user.manage(this.gameData.pressKeys))

    this.gameData.enemies.forEach(enemy => enemy.manage(
      [...this.gameData.users, ...this.gameData.enemies]
    ))
  }
}
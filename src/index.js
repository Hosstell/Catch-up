import {Balls, EnemyBall, UserBall} from './balls.js'
import settings from './settings.js'
import Game from './game.js'

var canvas = document.getElementById('game')
canvas.height = settings.height
canvas.width = settings.width

var context = canvas.getContext('2d')
var pressedKeys = new Set()
var users = [
  new UserBall(200, 120, 30, 2, {
    up: 87,
    down: 83,
    left: 68,
    right: 65
  }),
  // new UserBall(400, 100, 30, 2, {
  //   up: 38,
  //   down: 40,
  //   left: 39,
  //   right: 37
  // })
]
users[0].active = true


var enemies = [
  new EnemyBall(200, 400, 30, 2),
  // new EnemyBall(300, 600, 30, 2),
  // new EnemyBall(400, 300, 30, 2),
  // new EnemyBall(400, 200, 30, 2),
  // new EnemyBall(400, 700, 30, 2),
  // new EnemyBall(400, 750, 30, 2),
  // new EnemyBall(400, 800, 30, 2)
]

let game = new Game(
  context,
  pressedKeys,
  users,
  enemies
)

function index() {
  game.gameLoop()
  window.requestAnimationFrame(index)
}
index()


// Управление
window.onkeydown = (event) => {
  pressedKeys.add(event.keyCode.toString())
}

window.onkeyup = (event) => {
  pressedKeys.delete(event.keyCode.toString())
}








import {Balls, EnemyBall, UserBall} from './balls.js'
import settings from './settings.js'
import Game from './game.js'
import {Wall, Point} from './wall.js'

// var socket = io.connect('http://localhost:8000');
// socket.on('news', function (data) {
//   console.log(data);
//   socket.emit('my other event', { my: 'data' });
// });


var canvas = document.getElementById('game')
canvas.height = settings.height
canvas.width = settings.width

var context = canvas.getContext('2d')
var pressedKeys = new Set()
var users = [
  new UserBall(300, 120, 30, 3, {
    up: '87',
    down: '83',
    left: '68',
    right: '65'
  })
  // new UserBall(400, 100, 30, 2, {
  //   up: 38,
  //   down: 40,
  //   left: 39,
  //   right: 37
  // })
]
users[0].active = true


var enemies = [
  new EnemyBall(50, 100, 30, 2),
  // new EnemyBall(300, 600, 30, 2),
  // new EnemyBall(400, 300, 30, 2),
  // new EnemyBall(400, 200, 30, 2),
  // new EnemyBall(400, 700, 30, 2),
  // new EnemyBall(400, 750, 30, 2),
  // new EnemyBall(400, 800, 30, 2)
]

var walls = [
  new Wall(new Point(200, 200), new Point(700, 200)),
  new Wall(new Point(200, 300), new Point(700, 300)),
  new Wall(new Point(200, 400), new Point(500, 400)),
  new Wall(new Point(500, 400), new Point(500, 700)),
  new Wall(new Point(700, 300), new Point(700, 500)),
  // new Wall(new Point(700, 500), new Point(700, 700)),
  new Wall(new Point(700, 700), new Point(200, 700)),
]

let game = new Game(
  context,
  walls,
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








import {UserBall} from './balls.js'
import settings from './settings.js'
import Game from './game.js'
import {GameLogicClient} from './gameLogic.js'
import {Wall, Point} from './wall.js'


var canvas = document.getElementById('game')
canvas.height = settings.height
canvas.width = settings.width

var context = canvas.getContext('2d')
var pressedKeys = new Set()

// Управление стрелки
// var users = new UserBall(400, 100, 30, 2, {
//   up: 38,
//   down: 40,
//   left: 39,
//   right: 37
// })

// Управление WASD
var user = new UserBall(300, 120, 30, 3, {
  up: '87',
  down: '83',
  left: '68',
  right: '65'
})
// user.active = true

var walls = [
  new Wall(new Point(200, 200), new Point(400, 200)),
  new Wall(new Point(500, 200), new Point(700, 200)),
  new Wall(new Point(700, 200), new Point(700, 100)),
  new Wall(new Point(400, 200), new Point(400, 100)),
  new Wall(new Point(400, 100), new Point(700, 100)),
  new Wall(new Point(200, 300), new Point(700, 300)),
  new Wall(new Point(200, 400), new Point(500, 400)),
  new Wall(new Point(500, 400), new Point(500, 700)),
  new Wall(new Point(700, 300), new Point(700, 500)),
  // new Wall(new Point(700, 500), new Point(700, 700)),
  new Wall(new Point(700, 700), new Point(200, 700)),
]

let game = new Game(user, walls)
let gameLogicClient = new GameLogicClient(game, context)

function index() {
  gameLogicClient.loop()
}
setInterval(index, 10)


class HTML{
  // Определение цвета
  bindColorSelector(user) {
    let colorSelect = document.getElementById('colorSelect')
    colorSelect.value = localStorage.color ? localStorage.color : '000000'
    let changeColor = function () {
      localStorage.color = colorSelect.value
      let color = '#' + colorSelect.value
      user.changeColor(color)
    }
    colorSelect.onchange = changeColor
    changeColor()
  }

  bindNameField(user) {
    // Определение никнейма
    let nicknameSelect = document.getElementById('nicknameSelect')
    nicknameSelect.value = localStorage.name ? localStorage.name : '000000'
    let changeName = function () {
      localStorage.name = nicknameSelect.value
      let nickname = '#' + nicknameSelect.value
      user.changeName(nickname)
    }
    nicknameSelect.onchange = changeName
    changeName()
  }

  bindKeyboardClick(user) {
    window.onkeydown = (event) => {
      pressedKeys.add(event.keyCode.toString())
      user.changePressedKeys(pressedKeys)
    }

    window.onkeyup = (event) => {
      pressedKeys.delete(event.keyCode.toString())
      user.changePressedKeys(pressedKeys)
    }
  }
}

let html = new HTML()
html.bindColorSelector(user)
html.bindNameField(user)
html.bindKeyboardClick(user)

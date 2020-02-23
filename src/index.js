import {UserBall} from './balls.mjs'
import settings from './settings.mjs'
import {GameClient} from './game.mjs'
import {GameLogicClient} from './gameLogic.mjs'
import {Wall, Point} from './wall.mjs'
import SocketClient from './socketClient.mjs'


var canvas = document.getElementById('game')
canvas.height = settings.height
canvas.width = settings.width


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
      let nickname = nicknameSelect.value
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

  setPlayersList(players) {
    console.log(players)
    let playerList = document.getElementById('playersList')
    playerList.innerHTML = ''

    players.forEach(player => {
      playerList.appendChild(this._get_html_element(player))
    })
  }

  _get_html_element(user) {
    let element = document.createElement('div')
    element.style.display = 'flex'
    element.style.paddingTop = '10px'
    element.innerText = user.name

    let color = document.createElement('div')
    color.style.width = '20px'
    color.style.height = '20px'
    color.style.borderRadius = '10px'
    color.style.marginLeft = '5px'
    color.style.backgroundColor = user.color


    element.appendChild(color)
    return element
  }
}
let html = new HTML()

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
user.active = true

// var walls = [
//   new Wall(new Point(200, 200), new Point(400, 200)),
//   new Wall(new Point(500, 200), new Point(700, 200)),
//   new Wall(new Point(700, 200), new Point(700, 100)),
//   new Wall(new Point(400, 200), new Point(400, 100)),
//   new Wall(new Point(400, 100), new Point(700, 100)),
//   new Wall(new Point(200, 300), new Point(700, 300)),
//   new Wall(new Point(200, 400), new Point(500, 400)),
//   new Wall(new Point(500, 400), new Point(500, 700)),
//   new Wall(new Point(700, 300), new Point(700, 500)),
//   // new Wall(new Point(700, 500), new Point(700, 700)),
//   new Wall(new Point(700, 700), new Point(200, 700)),
// ]



var walls = [
  new Wall(new Point(50, 550), new Point(50, 750)),
  new Wall(new Point(50, 750), new Point(250, 750)),
  new Wall(new Point(300, 750), new Point(750, 750)),
  new Wall(new Point(650, 700), new Point(800, 700)),

  new Wall(new Point(300, 750), new Point(300, 550)),
  new Wall(new Point(300, 700), new Point(100, 700)),
  new Wall(new Point(250, 650), new Point(50, 650)),
  new Wall(new Point(300, 600), new Point(100, 600)),
  new Wall(new Point(250, 550), new Point(50, 550)),

  new Wall(new Point(300, 550), new Point(450, 550)),
  new Wall(new Point(450, 650), new Point(450, 550)),
  new Wall(new Point(450, 650), new Point(350, 650)),

  new Wall(new Point(300, 550), new Point(300, 200)),
  new Wall(new Point(500, 200), new Point(300, 200)),
]


html.bindColorSelector(user)
html.bindNameField(user)
html.bindKeyboardClick(user)

let game = new GameClient(user, walls)
let gameLogicClient = new GameLogicClient(game, context)
let socket = new SocketClient(html)
socket.bindGameLogic(gameLogicClient)
socket.connect()


function index() {
  gameLogicClient.loop()
}
setInterval(index, 10)




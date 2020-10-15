import settings from "./settings.js";
import {Game} from "./game.js";
import {GameLogic} from "./gameLogic.js";
import {Wall} from "./common/wall.js";
import {Point} from "./common/point.js";
import {User} from "./common/user.js"
import {GameVizualizator} from './gameVizualizator.js'
import getId from './common/id.js'
import {getCurrentTime, getTime} from './common/time.js'
import {Socket} from './socket.js'
import {getNameUser, setNameUser, setUserList, setUserColor} from './userPanel.js'

var canvas = document.getElementById('game')
canvas.height = settings.height
canvas.width = settings.width
var context = canvas.getContext('2d')


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


let users = [
  new User(getId(), 300, 120, 30),
  new User(getId(), 400, 120, 30),
]

let game = new Game(walls, getCurrentTime())

// game.addEvent(getCurrentTime(), {
//   id: users[0].id,
//   x: users[0].x,
//   y: users[0].y,
//   typeEvent: 'newUser'
// })
// game.addEvent(getCurrentTime(), {
//   id: users[1].id,
//   x: users[1].x,
//   y: users[1].y,
//   typeEvent: 'newUser'
// })

settings.myId = users[0].id

let gameVizualizator = new GameVizualizator(context)
let gameLogic = new GameLogic(game, gameVizualizator)
let gameSocket = new Socket()
gameSocket.connect(game, gameLogic.loop)

let pressedButton = new Set()
window.onkeydown = (event) => {
  let code = event.keyCode.toString()
  if (pressedButton.has(code)) {
    return
  }

  let newEvent = gameLogic.onkeydown(event)
  gameSocket.sendPressButtonEvent(newEvent)
  pressedButton.add(code)
}

window.onkeyup = (event) => {
  let code = event.keyCode.toString()
  let newEvent = gameLogic.onkeyup(event)
  gameSocket.sendPressButtonEvent(newEvent)
  pressedButton.delete(code)
}


function index() {
  gameLogic.loop()
}
setInterval(index, 10)




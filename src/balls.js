import settings from './settings.js'
import Vector from './vector.js'

export class Balls {
  constructor(x, y, size) {
    // Генерируем id
    this.id = Math.random().toString(36).substring(7)

    this.x = x
    this.y = y
    this.size = size
  }

  isNear(ball) {
    return this.distance(ball) < (this.radius() + ball.radius())
  }

  distance(ball) {
    return Math.sqrt((this.x - ball.x)*(this.x - ball.x) + (this.y - ball.y)*(this.y - ball.y))
  }

  radius() {
    return this.size/2
  }
}

export class PlayerBall extends Balls {
  constructor(x, y, size) {
    super(x, y, size)

    this.active = false
    this.status = true
    this.speed = 0.4
    this.vector = new Vector(0, 0)
    this.lastPressedKeys = []
    this.name = 'Игрок'
    this.color = '#000'
  }

  update() {
    this.x += this.vector.x
    this.y += this.vector.y

    this.vector.x *= settings.dragCoefficient
    this.vector.y *= settings.dragCoefficient

    this.checkBorder()
  }

  checkBorder() {
    let leftBorder = this.size/2
    let rightBorder = settings.height - this.size/2
    let topBorder = this.size/2
    let bottomBorder = settings.width - this.size/2

    if (this.y > rightBorder || this.y < leftBorder) {
      this.y = this.y > rightBorder ? rightBorder : this.y
      this.y = this.y < leftBorder ? leftBorder : this.y
      this.vector.y *= -1 * settings.borderCoefficient
    }

    if (this.x > bottomBorder || this.x < topBorder) {
      this.x = this.x > bottomBorder ? bottomBorder : this.x
      this.x = this.x < topBorder ? topBorder : this.x
      this.vector.x *= -1 * settings.borderCoefficient
    }
  }

  exchangeVector(obj) {
    //Первый вектор
    let punchNormalVectorA = new Vector(
      obj.x - this.x,
      obj.y - this.y
    ).norm()

    let angelCoeff = (punchNormalVectorA.multiply(this.vector)) / (punchNormalVectorA.length() * this.vector.length())
    angelCoeff = angelCoeff || 0
    let punchVectorA = punchNormalVectorA.multiply(angelCoeff*this.vector.length())

    // Второй вектор
    let punchNormalVectorB = new Vector(
      this.x - obj.x ,
      this.y - obj.y
    ).norm()

    angelCoeff = (punchNormalVectorB.multiply(obj.vector)) / (punchNormalVectorB.length() * obj.vector.length())
    angelCoeff = angelCoeff || 0
    let punchVectorB = punchNormalVectorB.multiply(angelCoeff*obj.vector.length())


    this.vector = this.vector.minus(punchVectorA)
    this.vector = this.vector.plus(punchVectorB)
    obj.vector = obj.vector.minus(punchVectorB)
    obj.vector = obj.vector.plus(punchVectorA)

    // Убрать прохождение одного шара через другой
    let vector = new Vector(
      obj.x - this.x,
      obj.y - this.y
    )
    let disBetweenBalls = this.radius() + obj.radius()
    if (vector.length() < disBetweenBalls) {
      let different = disBetweenBalls - vector.length()
      vector = vector.norm()

      this.x -= vector.x * different/2
      this.y -= vector.y * different/2
      obj.x += vector.x * different/2
      obj.y += vector.y * different/2
    }
  }

  render(ctx) {
    let r = this.size/2
    let x = this.x
    let y = this.y

    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(x, y, r, 0,Math.PI*2)
    ctx.fill()
    ctx.fillStyle = 'black'
    ctx.stroke()

    ctx.fillStyle = this.active ? 'black': 'white'
    ctx.beginPath()
    ctx.arc(x, y, r-7, 0,Math.PI*2)
    ctx.fill()
    ctx.fillStyle = 'black'
    ctx.stroke()
  }

  checkNearWall(wall) {
    let dis1 = Math.pow(wall.a.x - this.x, 2) + Math.pow(wall.a.y - this.y, 2)
    let dis2 = Math.pow(wall.b.x - this.x, 2) + Math.pow(wall.b.y - this.y, 2)
    let dis3 = Math.pow(wall.a.x - wall.b.x, 2) + Math.pow(wall.a.y - wall.b.y, 2)

    if ((dis1 > dis3) || (dis2 > dis3)) return


    let a = wall.a.y - wall.b.y
    let b = wall.b.x - wall.a.x
    let c = wall.a.x * wall.b.y - wall.b.x * wall.a.y

    let dis = Math.abs(a*this.x + b*this.y + c) / Math.sqrt(a*a + b*b)

    if (dis < this.radius()) {
      // Определение вектора отражения
      let n = new Vector(
        wall.a.y - wall.b.y,
        wall.b.x - wall.a.x
      ).norm()

      n = n.multiply(n.multiply(this.vector))
      this.vector = this.vector.minus(n.multiply(2))
      // this.vector = this.vector.multiply(settings.borderCoefficient)

      // Отодвинуть круг от отрезка
      // debugger
      let disDiff = this.radius() - dis
      n = n.norm().multiply(disDiff)
      this.x -= n.x
      this.y -= n.y
    }
  }

  exchangeActive(obj) {
    if (this.active && obj.active) return

    if (this.status && obj.status) {
      let active = this.active
      this.active = obj.active
      obj.active = active

      if (this.active) {
        this.status = false
        setTimeout(() => {this.status = true}, settings.waitAfterStatusFalse)
      }

      if (obj.active) {
        obj.status = false
        setTimeout(() => {obj.status = true}, settings.waitAfterStatusFalse)
      }
    }
  }

  doStep(pressedKeys) {
    // Чтобы обездвижить после заманивания
    if (!this.status) return

    let x = 0
    let y = 0

    let keys = {
      'up'    : () => { y -= this.speed },
      'down'  : () => { y += this.speed },
      'left'  : () => { x += this.speed },
      'right' : () => { x -= this.speed }
    }

    Object.keys(keys).forEach(key => {
      if (pressedKeys.includes(key)) {
        keys[key]()
      }
    })

    if (x !== 0 || y !== 0) {
      let dis = Math.sqrt(x*x + y*y)
      x = x * Math.abs(x/dis)
      y = y * Math.abs(y/dis)

      this.vector.x += x
      this.vector.y += y
    }
  }

  changeColor(color) {
    this.color = color
  }

  changeName(name) {
    this.name = name
  }
}

export class UserBall extends PlayerBall {
  constructor(x, y, size, maxSpeed, keyboard) {
    super(x, y, size, maxSpeed)

    this.keyboard = keyboard
  }

  changePressedKeys(pressedKeys) {
    // Оставляем только те нажатые клавиши, которые прописаны в keyboard объекта
    let lastPressedKeys = Object.keys(_.pickBy(this.keyboard, function(value, key, object) {
      return pressedKeys.has(value)
    }))

    if (lastPressedKeys.length !== this.lastPressedKeys.length) {
      // this.lastPressedKeys = lastPressedKeys
      this.pressedKeyAction(lastPressedKeys)
    }
  }

  // Метод запускающийся при нажатие кнопок
  pressedKeyAction () {}

  manage() {

    this.doStep(this.lastPressedKeys)
  }
}

export function createUserObjectByObject(obj) {
  let newPlayer =  new UserBall(obj.x, obj.y, obj.size)
  newPlayer.id = obj.id
  newPlayer.active = obj.active
  newPlayer.status = obj.status
  newPlayer.speed = obj.speed
  newPlayer.vector = new Vector(obj.vector.x, obj.vector.y)
  newPlayer.lastPressedKeys = obj.lastPressedKeys
  newPlayer.color = obj.color
  return newPlayer
}








































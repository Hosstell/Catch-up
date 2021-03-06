import settings from '../settings.js'
import Vector from './vector.js'
import {Ball} from './ball.js'

export class User extends Ball {
  constructor(id, x, y, size, color, name) {
    super(x, y, size)

    this.id = id
    this.active = true
    this.speed = 0.4
    this.vector = new Vector(0, 0)
    this.pressedKeys = new Set()
    this.name = name
    this.color = color
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
    let active = this.active
    this.active = obj.active
    obj.active = active
  }

  doStep() {
    let x = 0
    let y = 0

    let keys = {
      'up'    : () => { y -= this.speed },
      'down'  : () => { y += this.speed },
      'left'  : () => { x += this.speed },
      'right' : () => { x -= this.speed }
    }

    Object.keys(keys).forEach(key => {
      if (this.pressedKeys.has(key)) {
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
    this.updateMyData()
  }

  changeName(name) {
    this.name = name
    this.updateMyData()
  }

  updateMyData() {}
}

export class UserBall extends User {
  constructor(x, y, size, maxSpeed, keyboard) {
    super(x, y, size, maxSpeed)

    this.keyboard = keyboard
  }

  changePressedKeys(pressedKeys) {
    // Оставляем только те нажатые клавиши, которые прописаны в keyboard объекта
    let lastPressedKeys = Object.keys(_.pickBy(this.keyboard, function(value, key, object) {
      return pressedKeys.has(value)
    }))

    this.pressedKeyAction(lastPressedKeys)

    // console.log(lastPressedKeys, this.lastPressedKeys)
    // if (JSON.stringify(lastPressedKeys) !== JSON.stringify(this.lastPressedKeys)) {
    //   console.log(lastPressedKeys)
    //   // this.lastPressedKeys = lastPressedKeys
    //   this.pressedKeyAction(lastPressedKeys)
    // }
  }

  // Метод запускающийся при нажатие кнопок
  pressedKeyAction () {}

  manage() {
    this.doStep(this.lastPressedKeys)
  }
}

// export function createUserObjectByObject(obj) {
//   let newPlayer =  new UserBall(obj.x, obj.y, obj.size)
//   newPlayer.id = obj.id
//   newPlayer.active = obj.active
//   newPlayer.status = obj.status
//   newPlayer.speed = obj.speed
//   newPlayer.vector = new Vector(obj.vector.x, obj.vector.y)
//   newPlayer.lastPressedKeys = obj.lastPressedKeys
//   newPlayer.color = obj.color
//   newPlayer.name = obj.name
//   return newPlayer
// }
//
//






































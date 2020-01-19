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

    this.speed = 0.2
    this.vector = new Vector(0, 0)
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
    ctx.arc(x, y, r, 0,Math.PI*2)

    if (this.active) {
      ctx.fill()
    } else {
      ctx.stroke()
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
}

export class UserBall extends PlayerBall {
  constructor(x, y, size, maxSpeed, keyboard) {
    super(x, y, size, maxSpeed)

    this.keyboard = keyboard
  }

  manage(pressedKeys) {
    // Чтобы обездвижить после заманивания
    if (!this.status) return

    let x = 0
    let y = 0

    let keys = {
      [this.keyboard.up]    : () => { y -= this.speed },
      [this.keyboard.down]  : () => { y += this.speed },
      [this.keyboard.left]  : () => { x += this.speed },
      [this.keyboard.right] : () => { x -= this.speed }
    }

    Object.keys(keys).forEach(key => {
      if (pressedKeys.has(key)) {
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
}


export class EnemyBall extends UserBall {
  constructor(x, y, size, maxSpeed) {
    let keyboard = {
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right'
    }

    super(x, y, size, maxSpeed, keyboard)
  }

  manage(allPlayes) {
    let all = allPlayes.filter(player => player.id !== this.id)

    if (this.active) {
      // Нахождение близжайщего игрока
      let allPlayerDistances = all.filter(player => !player.active).map(player => this.distance(player))
      let minDistance = Math.min(...allPlayerDistances)
      let nearPlayer = all[allPlayerDistances.indexOf(minDistance)]


      // Составление пути к нему
      let pathVector = new Vector(
        this.x - nearPlayer.x,
        this.y - nearPlayer.y
      ).norm()

      pathVector.x = Math.abs(pathVector.x) > Math.random() ? pathVector.x : 0
      pathVector.y = Math.abs(pathVector.y) > Math.random() ? pathVector.y : 0

      let pressedKeys = new Set()
      if (pathVector.x > 0) {
        pressedKeys.add('right')
      }
      if (pathVector.x < 0) {
        pressedKeys.add('left')
      }
      if (pathVector.y > 0) {
        pressedKeys.add('up')
      }
      if (pathVector.y < 0) {
        pressedKeys.add('down')
      }
      super.manage(pressedKeys)

    } else {
      let activePlayer = all.filter(player => player.active)[0]

      // Вершины границ
      let points = [
        new Vector(this.size, this.size),
        new Vector(settings.width - this.size, this.size),
        new Vector(this.size, settings.height - this.size),
        new Vector(settings.width - this.size, settings.height - this.size),
      ]

      // Самая дальняя точка
      let allPointDistances = points.map(point => activePlayer.distance(point))
      let maxDistance = Math.max(...allPointDistances)
      points.splice(allPointDistances.indexOf(maxDistance), 1)

      allPointDistances = points.map(point => activePlayer.distance(point))
      maxDistance = Math.max(...allPointDistances)
      let awayPoint = points[allPointDistances.indexOf(maxDistance)]

      // Составление пути от него
      let pathVector = new Vector(
        this.x - awayPoint.x,
        this.y - awayPoint.y
      ).norm()

      pathVector.x = Math.abs(pathVector.x) > Math.random() ? pathVector.x : 0
      pathVector.y = Math.abs(pathVector.y) > Math.random() ? pathVector.y : 0

      let pressedKeys = new Set()
      if (pathVector.x > 0) {
        pressedKeys.add('right')
      }
      if (pathVector.x < 0) {
        pressedKeys.add('left')
      }
      if (pathVector.y > 0) {
        pressedKeys.add('up')
      }
      if (pathVector.y < 0) {
        pressedKeys.add('down')
      }
      super.manage(pressedKeys)
    }
  }
}











































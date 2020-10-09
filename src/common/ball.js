export class Ball {
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
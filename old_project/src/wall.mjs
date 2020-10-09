import settings from "./settings.mjs";

export class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

export class Wall {
  constructor(a, b) {
    this.a = new Point(a.x, a.y)
    this.b = new Point(b.x, b.y)
  }

  get length() {
    return Math.sqrt(Math.pow(this.a.x - this.b.x, 2) + Math.pow(this.a.y - this.b.y, 2))
  }

  render(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke();
  }

  renderVisibilityArea(gameData) {
    let user = gameData.users[0]

    let rays = [
      [user, new Point(0, 0)],
      [user, new Point(settings.width, 0)],
      [user, new Point(0, settings.height)],
      [user, new Point(settings.width, settings.height)]

    ]

    this.renderTriangle(
      gameData.ctx,
      user,
      new Point(0, 0),
      new Point(settings.width, 0)
    )
  }

  // :TODO Что-то с этим сделать
  renderTriangle(ctx, a, b, c) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.fill();
  }

  // Если входная стена пересекает текущуюю, ее обрезаем
  cut(ray) {
    // Определение статуса пересечения отрезков
    let if1 = (ray.b.x-ray.a.x)*(this.a.y-ray.a.y)-(ray.b.y-ray.a.y)*(this.a.x-ray.a.x)
    if1 = Math.abs(if1) < 0.00001 ? 0 : if1
    let if2 = (ray.b.x-ray.a.x)*(this.b.y-ray.a.y)-(ray.b.y-ray.a.y)*(this.b.x-ray.a.x)
    if2 = Math.abs(if2) < 0.00001 ? 0 : if2
    let if3 = (this.b.x-this.a.x)*(ray.a.y-this.a.y)-(this.b.y-this.a.y)*(ray.a.x-this.a.x)
    if3 = Math.abs(if3) < 0.00001 ? 0 : if3
    let if4 = (this.b.x-this.a.x)*(ray.b.y-this.a.y)-(this.b.y-this.a.y)*(ray.b.x-this.a.x)
    if4 = Math.abs(if4) < 0.00001 ? 0 : if4

    // debugger
    if ((if1*if2<=0) && (if3*if4<=0)) {
      let k1 = (this.b.y - this.a.y) / (this.b.x - this.a.x)
      let c1 = (this.b.x * this.a.y - this.a.x * this.b.y) / (this.b.x - this.a.x)
      let k2 = (ray.b.y - ray.a.y) / (ray.b.x - ray.a.x)
      let c2 = (ray.b.x * ray.a.y - ray.a.x * ray.b.y) / (ray.b.x - ray.a.x)

      let x = 0
      if ((this.b.x - this.a.x) === 0) {
        x = this.a.x
      } else {
        x = (c2 - c1) / (k1 - k2)
      }

      let y = k2 * x + c2
      ray.a = ray.b
      ray.b = new Point(x, y)
    }
  }

  isCrossed(ball) {

  }
}
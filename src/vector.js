export default class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y*this.y)
  }

  minus(v) {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  plus(v) {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  norm() {
    let len = this.length()
    let x = this.x * 1/len
    let y = this.y * 1/len
    return new Vector(x, y)
  }

  multiply(v) {
    if (v instanceof Vector) {
      return this.x * v.x + this.y * v.y
    } else {
      return new Vector(this.x * v, this.y * v)
    }
  }
}
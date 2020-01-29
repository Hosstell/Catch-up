import {AnotherUserBall} from './balls.js'

export default class Socket{
  constructor(gameData) {
    let socket = io.connect('http://188.233.50.109')
    this.socket = socket

    socket.emit('getNewUser', gameData.user)

    socket.emit('getAnotherUsers')
    socket.on('getAnotherUsers', function (anotherUsers) {
      anotherUsers.forEach(user => {
        gameData.enemies.push(
          new AnotherUserBall(anotherUsers.x, anotherUsers.y, 30, 2)
        )
      })
    })
  }


}
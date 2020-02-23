import {UserBall} from './balls.js'

export default class Socket{
  constructor(game) {
    let socket = io.connect('http://188.233.50.109')

    socket.emit('login', game.user)
    socket.emit('getAllUsers')


    // socket.on('newUserLogin', function(newUser) {
    //   game.e
    // })
    //
    // socket.on('getAllUsers', function (anotherUsers) {
    //   anotherUsers.forEach(user => {
    //     game.enemies.push(
    //       new UserBall(anotherUsers.x, anotherUsers.y, 30, 2)
    //     )
    //   })
    // })
  }
}
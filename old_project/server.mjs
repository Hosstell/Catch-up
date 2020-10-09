import express from 'express'
import http from 'http'
import socketIO from 'socket.io'
import {GameLogicServer} from './src/gameLogic'
import {GameServer} from "./src/gameServer.mjs";
import {Point, Wall} from "./src/wall";
import SocketServer from "./src/socketServer.mjs";

// init
var app = express();
var server = http.Server(app);
var io = socketIO(server);

// settings
server.listen(8000);
app.use(express.static('./'));

// router
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//
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
  new Wall(new Point(0, 300), new Point(100, 300)),
]

let game = new GameServer(null, walls)
let gameLogicServer = new GameLogicServer(game)
let socketServer = new SocketServer(io)
socketServer.bindGameLogic(gameLogicServer)


function index() {
  gameLogicServer.loop()
}
setInterval(index, 10)

// // socket
// io.on('connection', function (socket) {
//   let id
//
//   socket.on('login', function (user) {
//     console.log('New user connected. id: ' + user.id)
//
//     players.push(user)
//     id =  user.id
//     io.emit('newUserLogin', user)
//   })
//
//
//   socket.on('sendMyPressedKeyEvent', function (event) {
//     // setTimeout(() => {
//       io.emit('sendPressedKeyEvent', event)
//     // }, 100)
//   })
//
//   // Получение других пользователей
//
//
//   // Обновление данных пользователя
//   socket.on('updateUser', function (user) {
//     players = players.filter(player => player.id !== id)
//     players.push(user)
//     io.emit('updateUser', user)
//   })
//
//   socket.on('disconnect', function () {
//     console.log('User disconnected. id: ' + id)
//
//     players = players.filter(player => player.id !== id)
//     io.emit('deleteUser', id)
//   })
// });







// var express = require('express')
//
//
// // init
// var app = express()
// var server = require('http').Server(app);
// var io = require('socket.io')(server);
//
// // settings
// var port = 8000
// app.use(express.static('./'));
//
//
// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/index.html')
// })
//
// app.listen(port, function () {
//   console.log(`Express server listening on port: ${port}`)
// })
//

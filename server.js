var express = require('express')


// init
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);

// settings
var port = 8000
app.use(express.static('./'));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(port, function () {
  console.log(`Express server listening on port: ${port}`)
})


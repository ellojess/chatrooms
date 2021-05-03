//app.js

const express = require('express');
const app = express();
const server = require('http').Server(app);

// Socket.io
const io = require('socket.io')(server);
// store our online users here
let onlineUsers = {};
io.on("connection", (socket) => {
  // make sure to send the users to our chat file
  require('./sockets/chat.js')(io, socket, onlineUsers);
})

// express View Engine for Handlebars
const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
// establish your public folder
app.use('/public', express.static('public'))

app.get('/', (req, res) => {
  res.render('index.handlebars');
})

server.listen('3000', () => {
  console.log('Server listening on Port 3000');
})
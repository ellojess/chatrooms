//app.js

const express = require('express');
const app = express();
const server = require('http').Server(app);

// Socket.io
const io = require('socket.io')(server);
// store online users here
let onlineUsers = {};
// save the channels in this object.
let channels = {"General" : []};

io.on("connection", (socket) => {
  // make sure to send the users to our chat file
  require('./sockets/chat.js')(io, socket, onlineUsers, channels);
})

// express View Engine for Handlebars
const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
// establish public folder
app.use('/public', express.static('public'))

app.get('/', (req, res) => {
  res.render('index.handlebars');
})

server.listen('3000', () => {
  console.log('Server listening on Port 3000');
})
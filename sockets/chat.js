//chat.js

module.exports = (io, socket, onlineUsers, channels) => {

  socket.on('new user', (username) => {
    // save the username as key to access the user's socket id
    onlineUsers[username] = socket.id;
    // save the username to socket as well. This is important for later.
    socket["username"] = username;
    console.log(`✋ ${username} has joined the chat! ✋`);
    io.emit("new user", username);
  })

  socket.on('new message', (data) => {
    console.log(`🎤 ${data.sender}: ${data.message} 🎤`)
    // save the new message to the channel.
    channels[data.channel].push({sender : data.sender, message : data.message});
    // emit only to sockets that are in that channel room.
    io.to(data.channel).emit('new message', data);
  })

  socket.on('get online users', () => {
    // send over the onlineUsers
    socket.emit('get online users', onlineUsers);
  })

  // fires when a user closes out of the application
  // socket.on("disconnect") is a special listener
  // fires when a user exits out of the application
  socket.on('disconnect', () => {
    // delete user by using the username we saved to the socket
    delete onlineUsers[socket.username]
    io.emit('user has left', onlineUsers);
  });

  // when new channel button is pressed 
  socket.on('new channel', (newChannel) => {
    console.log(newChannel);
  });

  socket.on('new channel', (newChannel) => {
    // save the new channel to our channels object. The array will hold the messages
    channels[newChannel] = [];
    // have the socket join the new channel room
    socket.join(newChannel);
    // inform all clients of the new channel
    io.emit('new channel', newChannel);
    // emit to the client that made the new channel, to change their channel to the one they made
    socket.emit('user changed channel', {
      channel : newChannel,
      messages : channels[newChannel]
    });
  });

  // have the socket join the room of the channel
  socket.on('user changed channel', (newChannel) => {
    socket.join(newChannel);
    socket.emit('user changed channel', {
      channel : newChannel,
      messages : channels[newChannel]
    });
  });

  // display all existing channels created by users
  socket.on('update channels', () => {
    socket.emit('update channels', channels);
  })


}
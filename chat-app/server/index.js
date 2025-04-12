const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Initialize express app
const app = express();
app.use(cors());

// Create HTTP server with Express
const server = http.createServer(app);

// Initialize Socket.IO with the server and CORS settings
const io = socketIo(server, {
  cors: {
    origin: '*', // In production, specify actual domain
    methods: ['GET', 'POST']
  }
});

// Define a basic route
app.get('/', (req, res) => {
  res.send('Chat Server Running');
});

// Track users
const users = {};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Handle user joining
  socket.on('user_join', (username) => {
    users[socket.id] = username;
    io.emit('user_joined', { user: username, users: Object.values(users) });
    console.log(`${username} joined the chat`);
  });
  
  // Handle new message
  socket.on('send_message', (data) => {
    io.emit('receive_message', {
      message: data.message,
      user: users[socket.id],
      userId: socket.id,
      time: new Date().toLocaleTimeString()
    });
  });
  
  // Handle typing indicator
  socket.on('typing', () => {
    socket.broadcast.emit('user_typing', users[socket.id]);
  });
  
  // Handle user disconnect
  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      console.log(`${username} disconnected`);
      delete users[socket.id];
      io.emit('user_left', { user: username, users: Object.values(users) });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
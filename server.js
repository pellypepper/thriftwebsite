
// 4. Main Server File (server/server.js)
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require('./backend/routes/user');
const sellRouter = require('./backend/routes/sell'); 
const productRouter = require('./backend/routes/product'); 
const chatRouter = require('./backend/routes/chat');
const pool = require('./database/db');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;


// Initialize Express and Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow frontend to connect
    methods: ['GET', 'POST'], // Allow GET and POST methods
    credentials: true, // Allow credentials (cookies, etc.)
  },
});



const corsOptions = {
  origin: 'http://localhost:3000', // Allow frontend to communicate with the backend
  methods: ['GET', 'POST'], // Allow GET and POST methods
  credentials: true, // Allow credentials (e.g., cookies) to be sent
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use('/user', userRoutes);
app.use('/api/sell', sellRouter);
app.use('/api/product', productRouter);
app.use('/chat', chatRouter);



io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for sending a message
  socket.on('send-message', (messageData) => {
    const { chat_id, sender_id, message_text } = messageData;

    // Insert the message into the database
    pool.query(
      'INSERT INTO messages (chat_id, sender_id, message_text) VALUES ($1, $2, $3) RETURNING message_id',
      [chat_id, sender_id, message_text],
      (err, result) => {
        if (err) {
          console.error('Error sending message:', err);
          return;
        }

        // Emit the message to the other users in the chat
        io.emit('new-message', {
          chat_id,
          sender_id,
          message_text,
          message_id: result.rows[0].message_id,
        });
      }
    );
  });


  socket.on('join-chat', (chat_id) => {
    socket.join(chat_id); // Join a specific chat room based on the chat_id
    console.log(`User joined chat room with chat_id: ${chat_id}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
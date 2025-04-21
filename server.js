
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
const inboxRouter = require('./backend/routes/inbox');
const listRouter =  require('./backend/routes/listing');
const pool = require('./database/db');

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
  methods: ['GET', 'POST', 'DELETE', 'PUT'], // Allow GET and POST methods
  credentials: true, // Allow credentials (e.g., cookies) to be sent
};


app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/user', userRoutes);
app.use('/api/sell', sellRouter);
app.use('/api/product', productRouter);
app.use('/chat', chatRouter);
app.use('/inbox', inboxRouter);
app.use('/listing', listRouter);





app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});


app.use(express.static(path.join(__dirname, 'frontend', 'public'))); 

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
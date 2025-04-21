
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
const HOST = '0.0.0.0';


const app = express();
const PORT = process.env.PORT || 8080;


// Initialize Express and Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.REACT_APP_API_URL, // Allow frontend to connect
    methods: ['GET', 'POST'], // Allow GET and POST methods
    credentials: true, // Allow credentials (cookies, etc.)
  },
});



const corsOptions = {
  origin: process.env.REACT_APP_API_URL, 
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true,
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


app.use(express.static(path.join(__dirname, 'public'))); 

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,  'public', 'index.html'));
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});

// 4. Main Server File (server/server.js)
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const userRoutes = require('./backend/routes/user');
const sellRouter = require('./backend/routes/sell'); 
const productRouter = require('./backend/routes/product'); 
const pool = require('./database/db');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;




app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use('/user', userRoutes);
app.use('/api/sell', sellRouter);
app.use('/api/product', productRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
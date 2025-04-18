const express = require('express');
const router = express.Router();
const pool = require('../../database/db');
const { search, getItem} = require('../controller/product');

router.get('/items', getItem);

router.get("/search", search);


module.exports = router;
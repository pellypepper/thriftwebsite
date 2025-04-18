const express = require('express');
const router = express.Router();
const { createProduct } = require('../controller/sell');

router.post('/form', createProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createProduct, updateProduct } = require('../controller/sell');

router.post('/form', createProduct);


router.put('/updateForm', updateProduct)

module.exports = router;

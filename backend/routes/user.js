const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { auth , acct, getUserById } = require('../controller/user');




router.post('/auth', verifyToken, auth);



router.get('/acct',verifyToken, acct);

// router.get('/userId/:id', getUserById);

module.exports = router;
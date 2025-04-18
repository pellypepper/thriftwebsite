const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { auth , acct } = require('../controller/user');




router.post('/auth', verifyToken, auth);



router.get('/acct',verifyToken, acct);

module.exports = router;
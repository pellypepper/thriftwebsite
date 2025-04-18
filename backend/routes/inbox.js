
const express = require('express');
const { getChatId, getInfo} = require('../controller/inbox');
const router = express.Router();




router.get('/getChatId/:userId', getChatId)

router.post('/getInfo', getInfo);













module.exports = router;

const express = require('express');
const router = express.Router();

const { createChat, getUser, sendMessage, deleteMessage, getMessage } = require('../controller/chat');



router.post('/create-chat', createChat);
  
router.get('/getUser/:user', getUser);
  

router.post('/send-message',sendMessage);

router.delete('/delete-message/:chatId', deleteMessage);


router.get('/get-messages/:chat_id', getMessage);

module.exports = router;

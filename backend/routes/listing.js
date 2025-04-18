
const express = require('express');
const router = express.Router();
const { getUserItem, UpdateUserItem, deleteUserItem} = require('../controller/listing');



router.get('/getUserItem/:userId', getUserItem)

router.put('/getUserItem',UpdateUserItem)


router.delete('/deleteUserItem/:userId/:itemId', deleteUserItem);






module.exports = router;
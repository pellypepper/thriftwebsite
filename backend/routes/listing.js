// routes/chat.js
const express = require('express');
const router = express.Router();
const pool = require('../../database/db');



router.get('/getChatId/:userId', async (req, res) => {
const { userId } = req.params;
    try {
        const chatQuery = `
        SELECT chat_id FROM chats 
        WHERE buyer_id = $1 OR seller_id = $1
        `;
        const result = await pool.query(chatQuery, [userId]);
        if(result.rows.length === 0){
            return res.json({ message: 'No chat available' });
        }
        else {
          return  res.json(result.rows);
        }
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ message: 'Error fetching chat id ' });
    }
})

router.post('/getInfo', async (req, res) => {
    const { chatIds } = req.body; 

    if (!chatIds || chatIds.length === 0) {

        return res.status(400).json({ message: 'No chatIds provided' });
    }



    try {
        // placeholders for chatIds SQL query
        const chatPlaceholders = chatIds.map((_, index) => `$${index + 1}`).join(', ');

        //fetch item_ids associated with provided chatIds
        const chatQuery = `
            SELECT chat_id, item_id, seller_id, buyer_id
            FROM chats
            WHERE chat_id IN (${chatPlaceholders})
        `;

        const result = await pool.query(chatQuery, chatIds);

        if (result.rows.length === 0) {
         
            return res.json({ message: 'No chats found for the provided chatIds' });
        }

        // Extract item_ids from the result
        const itemIds = result.rows.map(row => row.item_id);


        // Generate item query placeholders
        const itemPlaceholders = itemIds.map((_, index) => `$${index + 1}`).join(', ');
        const itemQuery = `
            SELECT id, title, image_url
            FROM items
            WHERE id IN (${itemPlaceholders})
        `;
   
        const itemResult = await pool.query(itemQuery, itemIds);

        // Generate message query placeholders for chatIds (use different placeholder set)
        const messagePlaceholders = chatIds.map((_, index) => `$${index + 1}`).join(', ');
        const messagePlaceholdersSubquery = chatIds.map((_, index) => `$${index + 1 + chatIds.length}`).join(', ');
        
        // Fix: Subquery to get MAX(message_id) for each chat_id
   
const messageQuery = `
SELECT chat_id, message_text       
FROM messages
WHERE chat_id IN (${messagePlaceholders})      
AND message_id IN (
    SELECT MAX(message_id)
    FROM messages
    WHERE chat_id IN (${messagePlaceholdersSubquery})
    GROUP BY chat_id
)
`;


const messageResult = await pool.query(messageQuery, [...chatIds, ...chatIds]);

        // Check if itemResult or messageResult is empty
        if (itemResult.rows.length === 0) {
            console.error('No items found for the provided itemIds:', itemIds);
        }
        if (messageResult.rows.length === 0) {
            console.error('No messages found for the provided chatIds:', chatIds);
        }

        // Return the combined result (chat info, items, and messages)
        const combinedResult = chatIds.map(chatId => {
            const chatInfo = result.rows.find(row => row.chat_id === chatId);
            const itemInfo = itemResult.rows.find(row => row.id === chatInfo.item_id);
            const messageInfo = messageResult.rows.find(row => row.chat_id === chatId);

            return {
                chatId: chatId,
                sellerId: chatInfo.seller_id,
                buyerId: chatInfo.buyer_id,
                message_text: messageInfo ? messageInfo.message_text : null,
                title: itemInfo ? itemInfo.title : null,
                image_url: itemInfo ? itemInfo.image_url : null
            };
        });

        // Return the combined result (message_text, title, image_url)
        return res.json(combinedResult);
    } catch (error) {
        console.error('Error fetching chat info:', error);
        res.status(500).json({ message: 'Error fetching chat info' });
    }
});










module.exports = router;
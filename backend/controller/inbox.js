
const pool = require('../database/db');

// fecth user info based on chatId
const getInfo =  async (req, res) => {
    const { chatIds } = req.body;

    if (!chatIds || chatIds.length === 0) {
        return res.status(400).json({ message: 'No chatIds provided' });
    }

    try {

        // Placeholders for chatIds SQL query
        const chatPlaceholders = chatIds.map((_, index) => `$${index + 1}`).join(', ');

        // Fetch chat details
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

        // Query to get the latest message per chat_id, ordered by timestamp
        const messageQuery = `
            SELECT chat_id, message_text, timestamp
            FROM messages
            WHERE chat_id IN (${messagePlaceholders})
            ORDER BY timestamp DESC
        `;
        const messageResult = await pool.query(messageQuery, chatIds);

        if (itemResult.rows.length === 0) {
            console.error('No items found for the provided itemIds:', itemIds);
        }
        if (messageResult.rows.length === 0) {
            console.error('No messages found for the provided chatIds:', chatIds);
        }

        // Combine the results (chat info, items, and messages)
        const combinedResult = chatIds.map(chatId => {
            const chatInfo = result.rows.find(row => row.chat_id === chatId);
            const itemInfo = itemResult.rows.find(row => row.id === chatInfo.item_id);
            
            // Get the latest message (first message in ordered list)
            const messageInfo = messageResult.rows.find(row => row.chat_id === chatId);

            return {
                chatId: chatId,
                sellerId: chatInfo.seller_id,
                buyerId: chatInfo.buyer_id,
                message_text: messageInfo ? messageInfo.message_text : null,
                timestamp: messageInfo ? messageInfo.timestamp : null,  // Include timestamp of the latest message
                title: itemInfo ? itemInfo.title : null,
                image_url: itemInfo ? itemInfo.image_url : null
            };
        });

        // Sort the combined result by timestamp in descending order to ensure the most recent message is first
        const sortedCombinedResult = combinedResult.sort((a, b) => {
            const timestampA = new Date(a.timestamp);
            const timestampB = new Date(b.timestamp);

            return timestampB - timestampA;  // Sorting by timestamp descending (latest first)
        });

        // Return the sorted combined result (chat info, items, and messages)
        return res.json(sortedCombinedResult);
    } catch (error) {
        console.error('Error fetching chat info:', error);
        res.status(500).json({ message: 'Error fetching chat info' });
    }
}


// Fetch chatId based on userId
const getChatId = async (req, res) => {
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
    }

module.exports = { getInfo, getChatId }
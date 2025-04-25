const pool = require('../../database/db');

// fetch user info based on chatId
const getInfo = async (req, res) => {
    const { chatIds } = req.body;
    if (!chatIds || chatIds.length === 0) {
        return res.status(400).json({ message: 'No chatIds provided' });
    }
    try {
        // Fetch chat details
        const chatQuery = `
            SELECT chat_id, item_id, seller_id, buyer_id
            FROM chats
            WHERE chat_id = ANY($1::int[])
        `;
        const chatResult = await pool.query(chatQuery, [chatIds]);
        if (chatResult.rows.length === 0) {
            return res.json({ message: 'No chats found for the provided chatIds' });
        }
        
        const itemIds = chatResult.rows.map(row => row.item_id);
        const sellerIds = chatResult.rows.map(row => row.seller_id);
        
        // Fetch item details
        const itemQuery = `
            SELECT i.id, i.title, i.image_url
            FROM items i
            WHERE i.id = ANY($1::int[])
        `;
        const itemResult = await pool.query(itemQuery, [itemIds]);
        
        // Fetch seller details - separate query to get clerk_id from users table
        const sellerQuery = `
            SELECT id, clerk_id
            FROM users
            WHERE id = ANY($1::int[])
        `;
        const sellerResult = await pool.query(sellerQuery, [sellerIds]);
        
        // Fetch latest messages
        const messageQuery = `
            SELECT DISTINCT ON (chat_id) chat_id, message_text, timestamp
            FROM messages
            WHERE chat_id = ANY($1::int[])
            ORDER BY chat_id, timestamp DESC
        `;
        const messageResult = await pool.query(messageQuery, [chatIds]);
        
        // Debug what we got from database
        console.log("Item results:", itemResult.rows);
        console.log("Seller results:", sellerResult.rows);
        
        console.log("Seller query results:", sellerResult.rows);

// Check if each seller has a clerk_id

        // Combine data
        const combinedResult = chatIds.map(chatId => {
            const chatInfo = chatResult.rows.find(row => row.chat_id === chatId);
            if (!chatInfo) {
                console.error(`No chat info found for chatId: ${chatId}`);
                return {
                    chatId,
                    message: `No chat info available for chatId: ${chatId}`,
                };
            }
            
            const itemInfo = itemResult.rows.find(row => row.id === chatInfo.item_id);
            if (!itemInfo) {
                console.error(`No item info found for itemId: ${chatInfo.item_id}`);
            }
            
            // Get seller info for clerk_id
            const sellerInfo = sellerResult.rows.find(row => row.id === chatInfo.seller_id);
            if (!sellerInfo) {
                console.error(`No seller info found for sellerId: ${chatInfo.seller_id}`);
            }
            
            const messageInfo = messageResult.rows.find(row => row.chat_id === chatId);
            const missingClerkIds = sellerResult.rows.filter(row => !row.clerk_id);
console.log("Sellers missing clerk_id:", missingClerkIds);
            
            // Create the response object with clerk_id
            const responseObj = {
                chatId,
                sellerId: chatInfo.seller_id,
                buyerId: chatInfo.buyer_id,
                message_text: messageInfo ? messageInfo.message_text : null,
                timestamp: messageInfo ? messageInfo.timestamp : null,
                title: itemInfo ? itemInfo.title : null,
                image_url: itemInfo ? itemInfo.image_url : null,
                clerk_id: sellerInfo ? sellerInfo.clerk_id : null,
            };
            
            // Debug the constructed response object
            console.log(`Response for chatId ${chatId}:`, responseObj);
            
            return responseObj;
        });
        
        // Sort by timestamp in descending order
        const sortedCombinedResult = combinedResult.sort((a, b) => {
            if (!a.timestamp) return 1;
            if (!b.timestamp) return -1;
            const timestampA = new Date(a.timestamp);
            const timestampB = new Date(b.timestamp);
            return timestampB - timestampA;
        });
        
        // Debug final response
        console.log("Final response:", sortedCombinedResult);
        
        return res.json(sortedCombinedResult);
    } catch (error) {
        console.error('Error fetching chat info:', error);
        res.status(500).json({ message: 'Error fetching chat info' });
    }
};

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
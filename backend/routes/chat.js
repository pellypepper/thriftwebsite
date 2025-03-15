// routes/chat.js
const express = require('express');
const router = express.Router();
const pool = require('../../database/db');

// Create a new chat between a buyer and a seller
router.post('/create-chat', async (req, res) => {
    const { buyer_id, seller_id, product_id } = req.body;
  
    try {

        if (buyer_id === seller_id) {
            return res.status(400).json({ message: 'Buyer and seller cannot be the same.' });
        }
        
        // First, check if a chat already exists between the buyer, seller, and product
      const checkChatQuery = `
        SELECT chat_id FROM chats 
        WHERE buyer_id = $1 OR seller_id = $1 AND item_id = $2
      `;
      const checkResult = await pool.query(checkChatQuery, [buyer_id,  product_id]);
       
      if (checkResult.rows.length > 0) {
        // If a chat exists, return the existing chat_id
        const existingChatId = checkResult.rows[0].chat_id;
        return res.json({ chat_id: existingChatId });
      }
  
      // If no chat exists, create a new chat
      const chatQuery = `
        INSERT INTO chats (buyer_id, seller_id, item_id) 
        VALUES ($1, $2, $3) 
        RETURNING chat_id
      `;
      const result = await pool.query(chatQuery, [buyer_id, seller_id, product_id]);
  
      const chat_id = result.rows[0].chat_id;
      return res.json({ chat_id });
  
    } catch (error) {
      console.error('Error creating chat:', error);
      res.status(500).json({ message: 'Error creating chat' });
    }
  });
  

// Backend: Fetch user
router.get('/getUser/:user', async (req, res) => {
    const { user } = req.params;
    try {
        const chatQuery = `
        SELECT * FROM users 
        WHERE clerk_id = $1
        `;
        const result = await pool.query(chatQuery, [user]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
  });
  
// Send a message in a chat
router.post('/send-message', async (req, res) => {
  const { chat_id, sender_id, message_text } = req.body;

  try {
    const messageQuery = `
      INSERT INTO messages (chat_id, sender_id, message_text) 
      VALUES ($1, $2, $3) 
      RETURNING message_id
    `;
    const result = await pool.query(messageQuery, [chat_id, sender_id, message_text]);

    const message_id = result.rows[0].message_id;
    res.json({ message_id });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Get all messages for a specific chat
router.get('/get-messages/:chat_id', async (req, res) => {
  const { chat_id } = req.params;

  try {
    const messagesQuery = 'SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp';
    const result = await pool.query(messagesQuery, [chat_id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;

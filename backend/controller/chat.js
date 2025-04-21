const pool = require('../db');
const {sendEmail} = require('../utils/email')



// Create a new chat between a buyer and a seller
 const createChat = async (req, res) => {
    const { buyer_id, seller_id, product_id } = req.body;
  
    try {

        if (buyer_id === seller_id) {
            return res.status(400).json({ message: 'Buyer and seller cannot be the same.' });
        }
        
        // First, check if a chat already exists between the buyer, seller, and product
      const checkChatQuery = `
        SELECT chat_id FROM chats 
        WHERE buyer_id = $1 AND seller_id = $2 AND item_id = $3
      `;
      const checkResult = await pool.query(checkChatQuery, [buyer_id, seller_id,  product_id]);
       
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
  }

  //  Fetch user information based on user ID
 const getUser =  async (req, res) => {
    const { user } = req.params;
    try {
        const chatQuery = `
        SELECT * FROM users 
        WHERE clerk_id = $1
        `;
        const result = await pool.query(chatQuery, [user]);
      return  res.json(result.rows);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
  }

  // Send a message in a chat
  const sendMessage =  async (req, res) => {
    const { chat_id, sender_id, message_text, message_sender } = req.body;
  
    try {
      const messageQuery = `
        INSERT INTO messages (chat_id, sender_id, message_text, message_sender) 
        VALUES ($1, $2, $3, $4) 
        RETURNING message_id
      `;
      const result = await pool.query(messageQuery, [chat_id, sender_id, message_text, message_sender ]);
  
      const message_id = result.rows[0].message_id;
      
      const notification = await getNotification(sender_id, chat_id);

      if (notification?.error) {
        console.warn('Email notification failed:', notification.error);
      }
      res.json({ message_id });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Error sending message' });
    }
  }

  // delete chat
  const deleteMessage = async (req, res) => {
    const { chatId } = req.params; // Extract chatId from URL parameters
  
    
    if (!chatId || isNaN(chatId)) {
      return res.status(400).json({ message: 'Invalid chatId format' });
    }
  
    try {
      // Check if the chat exists
      const result = await pool.query('SELECT chat_id FROM chats WHERE chat_id = $1', [chatId]);
  
      if (result.rows.length > 0) {
        // Chat exists, delete it
        await pool.query('DELETE FROM chats WHERE chat_id = $1', [chatId]);
        res.status(200).json({ message: 'Chat deleted successfully' });
      } else {
        // Chat does not exist
        res.status(404).json({ message: 'Chat not found' });
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error(error);
      res.status(500).json({ message: 'Server error, unable to delete chat' });
    }
  }

// Get all messages for a specific chat
  const getMessage =  async (req, res) => {
    const { chat_id } = req.params;
  
    try {
      const messagesQuery = 'SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp';
      const result = await pool.query(messagesQuery, [chat_id]);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Error fetching messages' });
    }
  }

  const getNotification = async (userId, chat_id) => {
    try {
      const result = await pool.query(
        `SELECT buyer_id, seller_id FROM chats WHERE chat_id = $1`,
        [chat_id]
      );
  
      const chat = result.rows[0];
      if (!chat) {
        console.error('Chat not found');
        return;
      }
  
      // Determine the "other" user (not the one sending the message)
      const otherUserId = chat.buyer_id !== userId ? chat.buyer_id : chat.seller_id;
  
      const emailResult = await pool.query(
        `SELECT email FROM users WHERE id = $1`,
        [otherUserId]
      );
  
      const email = emailResult.rows[0]?.email;
      if (email) {
        console.log('Sending email to:', email);

        await sendEmail({
          to: email, 
          subject: 'New Message',
          text: 'You have a new message. Please log in to check it.',
        });
        console.log('✅ Email sent to', email);
      } else {
        console.warn('User email not found');
      }
    } catch (error) {
      console.error('❌ Error sending notification:', error.message);
      return { error: 'Unable to send notification' };
    }
  };
  
  


module.exports = { createChat, getUser, sendMessage, deleteMessage, getMessage };

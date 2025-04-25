const pool = require('../../database/db')
const path = require('path');
console.log(path.resolve(__dirname, '../../database/db'));


const acct =  async (req, res) => {
 
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE clerk_id = $1',
        [req.userId]
      );
  
      if (!result.rows[0]) {
        // Create user if doesn't exist
        const newUser = await pool.query(
          'INSERT INTO users (clerk_id, email) VALUES ($1, $2) RETURNING *',
          [req.userId, req.email]
        );
        return res.json(newUser.rows[0]);
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

const auth =  async (req, res) => {

    
    const { clerkId, email, firstName, lastName, username } = req.body;
    
    // Validate required fields
    if (!clerkId) {
    
      return res.status(400).json({ error: 'clerkId is required' });
    }
  
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE clerk_id = $1',
        [clerkId]
      );
  
      if (!result.rows[0]) {
        const newUser = await pool.query(
          'INSERT INTO users (clerk_id, email, firstname, lastname, username) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [clerkId, email, firstName, lastName, username]
        );
        return res.json(newUser.rows[0]);
      }
      
      const updatedUser = await pool.query(
        'UPDATE users SET email = $2, firstname = $3, lastname = $4, username = $5 WHERE clerk_id = $1 RETURNING *',
        [clerkId, email, firstName, lastName, username]
      );
      
      res.json(updatedUser.rows[0]);
     
    } catch (error) {
  
      res.status(500).json({ error: error.message });
    }
  }

  // const getUserById = async (req, res) => {
  //   const { id } = req.params;
  
  //   try {
  //     const response = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  
  //     if (response.rows.length === 0) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  
  //     return res.json(response.rows[0]);
  //   } catch (error) {
  //     console.error('Error fetching user by ID:', error);
  //     return res.status(500).json({ message: 'Server error while fetching user' });
  //   }
  // };
  
module.exports = { acct, auth };
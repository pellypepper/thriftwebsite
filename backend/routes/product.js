const express = require('express');
const router = express.Router();
const pool = require('../../database/db');


router.get('/items', async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query; 

   // Calculate offset for pagination
  const offset = (page - 1) * limit;


    try {
        let response;

        if (['HomeGarden', 'Entertainment', 'ClothingAccessories', 'Hobbies', 'Electronics', 'Family'].includes(category)) {
          response = await pool.query('SELECT * FROM items WHERE main_category = $1 AND available = true LIMIT $2 OFFSET $3', [category, limit, offset]);
        } 
        else  {
           const result = await pool.query('SELECT * FROM items WHERE category = $1 LIMIT $2 OFFSET $3', [category, limit, offset]);
           response = result.rows.filter(item => item.main_category !== category); 
        } 
        

        if (response.rows.length > 0) {
            console.log(response.rows);  
            res.json(response.rows);
        } else {
            res.status(404).json({ message: 'No items found.' });
        }

    } catch (error) {
        console.error('Error fetching items:', error); 
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
      return res.json([]);
  }

  try {
      // Execute query properly
      const result = await pool.query(
          "SELECT * FROM items WHERE title ILIKE $1", 
          [`%${query}%`]
      );

      res.json(result.rows);
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
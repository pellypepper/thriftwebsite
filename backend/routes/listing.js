// routes/chat.js
const express = require('express');
const router = express.Router();
const pool = require('../../database/db');



router.get('/getUserItem/:userId', async (req, res) => {
        const { userId } = req.params;
        if(!userId){
            res.status(400).json({ message: 'user id is required' });
        }

        try {
            const userItemQuery = `
            SELECT * FROM items
            WHERE clerk_id = $1
            `;
            const result = await pool.query(userItemQuery, [userId]);
            if(result.rows.length === 0){
                return res.json({ message: 'No item available' });
            }
            else {
              return  res.json(result.rows);
            }
        } catch (error) {
            console.error('Error fetching user item:', error);
            res.status(500).json({ message: 'Error fetching user item' });
        }
})

router.put('/getUserItem', async (req, res) => {
       const {userId,itemId,available} = req.body

       if (!userId || available === undefined || !itemId){
        return res.status(400).json({ message: 'userId and itemId are required' });
    }
       try {
        const updateItemQuery = `
        UPDATE items
        SET available = $1
        WHERE clerk_id = $2 AND id = $3
        RETURNING *
        `;
        const result = await pool.query(updateItemQuery, [ available,userId,itemId]);
        if(result.rows.length === 0){
            return res.json({ message: 'No item available' });
        }
        else {
          return  res.json(result.rows);
        }
    } catch (error) {
        console.error('Error fetching user item:', error);
        res.status(500).json({ message: 'Error fetching user item' });
       }

})


router.delete('/deleteUserItem/:userId/:itemId', async (req, res) => {
    const { userId,itemId } = req.params;
    if(!userId || !itemId){
        res.status(400).json({ message: 'user id and item id is required' });
    }

    try {
        const userItemQuery = `
        DELETE FROM items
        WHERE clerk_id = $1 AND id = $2
        `;
        const result = await pool.query(userItemQuery, [userId,itemId]);
        if(result.rows.length === 0){
            return res.json({ message: 'No item available' });
        }
        else {
          return  res.json(result.rows);
        }
    } catch (error) {
        console.error('Error fetching user item:', error);
        res.status(500).json({ message: 'Error fetching user item' });
    }


})






module.exports = router;
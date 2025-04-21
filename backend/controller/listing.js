const pool = require('../../../database/db');


const getUserItem =  async (req, res) => {
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
}


const UpdateUserItem =  async (req, res) => {
    const {userId,itemId,available} = req.body

    if (!userId || available === undefined || !itemId){
     return res.status(400).json({ message: 'userId and itemId are required' });
 }
    try {
      
    const newAvailability = available;
     const updateItemQuery = `
     UPDATE items
     SET available = $1
     WHERE clerk_id = $2 AND id = $3
     RETURNING *
     `;
     const result = await pool.query(updateItemQuery, [ newAvailability,userId,itemId]);
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

}


const deleteUserItem =  async (req, res) => {
    const { userId, itemId } = req.params;

 
    if (!userId || !itemId) {
        return res.status(400).json({ message: 'user id and item id are required' });
    }

    try {
        const userItemQuery = `
        DELETE FROM items
        WHERE clerk_id = $1 AND id = $2
        RETURNING *;  
        `;
        const result = await pool.query(userItemQuery, [userId, itemId]);

       
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No item found with the provided userId and itemId' });
        }

        // Success response, confirming the item was deleted
        return res.status(200).json({ message: 'Item successfully deleted' });
    } catch (error) {
        console.error('Error deleting user item:', error);
        return res.status(500).json({ message: 'Error deleting user item' });
    }
}


module.exports = { getUserItem, UpdateUserItem, deleteUserItem };
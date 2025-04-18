const { clerkClient } = require('@clerk/clerk-sdk-node');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    
    const decoded = await clerkClient.verifyToken(token);
    console.log(decoded.sub);
    req.userId = decoded.sub;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = verifyToken;

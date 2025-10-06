const config = require('../config');
const jwt = require('jsonwebtoken');

// Use consistent JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'shopease-super-secret-key-2024';

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.replace('Bearer ', '') 
      : authHeader;

    console.log('🔍 Received token:', token ? 'Token exists' : 'No token');

    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token with the SAME secret used for signing
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log('✅ Token verified successfully for user:', decoded.id);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token signature' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else {
      return res.status(401).json({ message: 'Token verification failed' });
    }
  }
};

module.exports = authMiddleware;

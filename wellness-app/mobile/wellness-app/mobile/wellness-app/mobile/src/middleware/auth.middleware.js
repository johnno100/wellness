const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token error' });
  }
  
  const [scheme, token] = parts;
  
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token malformatted' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.userId = decoded.id;
    return next();
  });
};

// Middleware to check if user has admin role
exports.isAdmin = (req, res, next) => {
  // This would typically check the user's role in the database
  // For MVP, we'll just implement the structure
  next();
};

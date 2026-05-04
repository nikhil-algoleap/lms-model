const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'algoleap-lms-super-secret-key-2026';

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

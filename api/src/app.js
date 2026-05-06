const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/auth.middleware');

dotenv.config();

const app = express();

// Trust proxy for express-rate-limit on Render
app.set('trust proxy', 1);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Increased to avoid blocking during usage
  message: 'Too many requests from this IP, please try again after 15 minutes'
});


// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json());

// Public Routes
app.use('/api/auth', require('./routes/auth.routes'));

// Protected Routes (Required JWT)
app.use('/api/dashboard', authMiddleware, require('./routes/dashboard.routes'));
app.use('/api/leads', authMiddleware, require('./routes/leads.routes'));
app.use('/api/accounts', authMiddleware, require('./routes/accounts.routes'));
app.use('/api/contacts', authMiddleware, require('./routes/contacts.routes'));
app.use('/api/admin', authMiddleware, require('./routes/admin.routes'));
app.use('/api/import', authMiddleware, require('./routes/import.routes'));
app.use('/api/deals', authMiddleware, require('./routes/deals.routes'));

// Basic Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
require('dotenv').config();
// Initialize Express app FIRST
const app = express();

// Middleware (CORS must come before routes)
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(config.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('🔄 Attempting MongoDB connection...');
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});

// Database connection logging
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected to database:', mongoose.connection.name);
});
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});


  // Routes
  const authRoutes = require('./routes/auth');
  const cartRoutes = require('./routes/cart');
  const orderRoutes = require('./routes/orders');
  const productRoutes = require('./routes/products');
  const adminAuthRoutes = require('./routes/adminAuth');
  const adminOrderRoutes = require('./routes/adminOrders');
  const adminMetricsRoutes = require('./routes/adminMetrics');
  
  
  // Register all routes (after middleware)
  app.use('/api/auth', authRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin/auth', adminAuthRoutes);
  app.use('/api/admin/orders', adminOrderRoutes);
  app.use('/api/admin/metrics', adminMetricsRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'ShopEase API is running! 🚀' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;

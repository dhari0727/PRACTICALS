const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('../config');

const router = express.Router();

// Health check for debugging routing issues
router.get('/health', (req, res) => {
  res.json({ ok: true, route: '/api/admin/auth/health' });
});

// POST /api/admin/auth/login
router.post('/login', async (req, res) => {
  try {
    console.log('[ADMIN AUTH] POST /login request received');
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.warn('[ADMIN AUTH] Admin not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.warn('[ADMIN AUTH] Password mismatch for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { id: admin._id, email: admin.email, role: 'admin' };
    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '2d' });

    res.json({
      message: 'Login successful',
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

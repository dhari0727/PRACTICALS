const express = require('express');
const router = express.Router();

const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Order = require('../models/Order');

// All routes below require admin JWT
router.use(adminAuth);

// GET /api/admin/orders - list with filters, sorting, pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt', status, from, to, q, minTotal, maxTotal, customerId } = req.query;

    const filter = {};
    if (status) {
      const statuses = Array.isArray(status) ? status : String(status).split(',');
      filter.status = { $in: statuses };
    }
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    if (q) {
      filter.$or = [
        { orderNumber: { $regex: q, $options: 'i' } },
        { 'shippingAddress.email': { $regex: q, $options: 'i' } }
      ];
    }
    if (minTotal || maxTotal) {
      filter.totalPrice = {};
      if (minTotal) filter.totalPrice.$gte = Number(minTotal);
      if (maxTotal) filter.totalPrice.$lte = Number(maxTotal);
    }
    if (customerId) filter.user = customerId;

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Order.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'name email')
        .lean(),
      Order.countDocuments(filter)
    ]);

    res.json({
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)) || 1
      }
    });
  } catch (err) {
    console.error('Admin orders list error:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// GET /api/admin/orders/export - CSV export with same filters
router.get('/export', async (req, res) => {
  try {
    const { status, from, to, q, minTotal, maxTotal, customerId, sort = '-createdAt' } = req.query;
    const filter = {};

    if (status) {
      const statuses = Array.isArray(status) ? status : String(status).split(',');
      filter.status = { $in: statuses };
    }
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    if (q) {
      filter.$or = [
        { orderNumber: { $regex: q, $options: 'i' } },
        { 'shippingAddress.email': { $regex: q, $options: 'i' } }
      ];
    }
    if (minTotal || maxTotal) {
      filter.totalPrice = {};
      if (minTotal) filter.totalPrice.$gte = Number(minTotal);
      if (maxTotal) filter.totalPrice.$lte = Number(maxTotal);
    }
    if (customerId) filter.user = customerId;

    const rows = await Order.find(filter)
      .sort(sort)
      .populate('user', 'name email')
      .lean();

    const header = ['orderNumber','status','totalPrice','createdAt','customerName','customerEmail'];
    const csv = [header.join(',')].concat(
      rows.map(r => [
        r.orderNumber,
        r.status,
        r.totalPrice,
        new Date(r.createdAt).toISOString(),
        (r.user && r.user.name) || '',
        (r.user && r.user.email) || ''
      ].map(v => typeof v === 'string' && v.includes(',') ? `"${String(v).replace(/"/g,'""')}"` : v).join(','))
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    res.send(csv);
  } catch (err) {
    console.error('Admin orders export error:', err);
    res.status(500).json({ message: 'Failed to export orders' });
  }
});

// GET /api/admin/orders/:id - details
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('products.product')
      .lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // timeline placeholder (if not stored)
    order.timeline = [
      { type: 'created', message: 'Order created', at: order.createdAt },
      { type: 'status', message: `Status: ${order.status}`, at: order.updatedAt }
    ];

    res.json({ order });
  } catch (err) {
    console.error('Admin order detail error:', err);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
});

// PATCH /api/admin/orders/:id/status - update status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, reason } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const allowed = ['pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled', 'canceled', 'refunded'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Status updated', order });
  } catch (err) {
    console.error('Admin order status update error:', err);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// POST /api/admin/orders/:id/cancel - cancel order
router.post('/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'canceled' },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order canceled', order });
  } catch (err) {
    console.error('Admin order cancel error:', err);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
});

// POST /api/admin/orders/:id/refund - refund order (stub)
router.post('/:id/refund', async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Simple logic: if amount >= totalPrice -> refunded, else keep status but respond OK
    if (Number(amount) >= Number(order.totalPrice)) {
      order.status = 'refunded';
      await order.save();
    }

    res.json({ message: 'Refund processed (stub)', order });
  } catch (err) {
    console.error('Admin order refund error:', err);
    res.status(500).json({ message: 'Failed to process refund' });
  }
});

module.exports = router;

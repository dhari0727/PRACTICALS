const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Order = require('../models/Order');

router.use(adminAuth);

// GET /api/admin/metrics
router.get('/', async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [ordersToday, revenueTodayAgg, statusAgg, last7dAgg] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfToday } } },
        { $group: { _id: null, revenue: { $sum: '$totalPrice' } } }
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } } },
        { $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        } },
        { $sort: { _id: 1 } }
      ])
    ]);

    const revenueToday = revenueTodayAgg[0]?.revenue || 0;
    const statusBreakdown = statusAgg.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {});
    const orders7dTrend = last7dAgg.map(d => ({ date: d._id, count: d.count, revenue: d.revenue }));

    res.json({ ordersToday, revenueToday, statusBreakdown, orders7dTrend });
  } catch (err) {
    console.error('Admin metrics error:', err);
    res.status(500).json({ message: 'Failed to fetch metrics' });
  }
});

module.exports = router;

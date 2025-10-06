// POST /api/orders - Create new order with shipping details

const express = require('express');
const router = express.Router();

// middleware
const auth = require('../middleware/auth');

// models
const Order = require('../models/Order');
const Product = require('../models/Product');

router.post('/', auth, async (req, res) => {
  try {
    const { 
      productId, 
      quantity, 
      price, 
      totalPrice, 
      productDetails, 
      shippingAddress,
      paymentMethod 
    } = req.body;
    
    const userId = req.user.id;

    console.log('📝 Creating order with shipping details:', { 
      userId, 
      productId, 
      quantity, 
      totalPrice,
      shippingAddress,
      paymentMethod 
    });

    // Validate required fields
    if (!productId || !quantity || !price || !totalPrice || !shippingAddress) {
      return res.status(400).json({ message: 'Missing required order data' });
    }

    // Find or create product
    let product = await Product.findOne({ externalId: productId });
    
    if (!product && productDetails) {
      product = new Product({
        name: productDetails.title,
        price: parseFloat(price),
        image: productDetails.image,
        description: productDetails.description || '',
        category: productDetails.category || 'general',
        stock: 100,
        externalId: productId
      });
      await product.save();
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create order with shipping details
    const order = new Order({
      user: userId,
      products: [{
        product: product._id,
        quantity: parseInt(quantity),
        price: parseFloat(price)
      }],
      totalPrice: parseFloat(totalPrice),
      status: 'pending',
      orderDate: new Date(),
      shippingAddress: {
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode
      },
      paymentMethod: paymentMethod || 'cod',
      orderNumber: `ORD-${Date.now()}-${userId.toString().slice(-4)}`
    });

    await order.save();
    await order.populate('products.product');

    console.log('✅ Order created successfully:', order._id);

    res.status(201).json({ 
      message: 'Order placed successfully! 🎉',
      orderId: order._id,
      orderNumber: order.orderNumber,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create order. Please try again.',
      error: error.message 
    });
  }
});
module.exports = router;

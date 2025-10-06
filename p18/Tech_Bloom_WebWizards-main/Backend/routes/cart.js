const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Utility function to safely compare ObjectIds
function safeObjectIdEquals(a, b) {
  try {
    if (!a || !b) return false;
    
    // Convert to strings for comparison
    const aStr = typeof a === 'string' ? a : a.toString();
    const bStr = typeof b === 'string' ? b : b.toString();
    
    return aStr === bStr;
  } catch (error) {
    return false;
  }
}

// GET /api/cart - Get user's cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('🛒 Fetching cart for user:', userId);

    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.json({ 
        items: [], 
        total: 0,
        itemCount: 0,
        message: 'Cart is empty' 
      });
    }

    // Filter out items where product no longer exists
    const validItems = cart.items.filter(item => {
      if (!item.product || item.product === null) {
        console.log('⚠️ Found invalid item in cart, will be removed:', item._id);
        return false;
      }
      return true;
    });

    // Update cart if there were invalid items
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
      console.log('🧹 Cleaned up invalid items from cart');
    }

    const itemsWithDetails = validItems.map(item => ({
      _id: item._id,
      product: item.product._id,
      externalId: item.product.externalId,
      quantity: item.quantity,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      description: item.product.description,
      category: item.product.category,
      subtotal: (item.product.price * item.quantity).toFixed(2)
    }));

    const total = validItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 0
    );

    console.log('✅ Cart fetched successfully. Items:', itemsWithDetails.length);

    res.json({
      items: itemsWithDetails,
      total: parseFloat(total.toFixed(2)),
      itemCount: validItems.length
    });

  } catch (error) {
    console.error('❌ Get cart error:', error);
    res.status(500).json({ message: 'Failed to fetch cart items' });
  }
});

// POST /api/cart/add - Add item to cart
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, productDetails } = req.body;

    console.log('🛒 Adding to cart:', { userId, productId, quantity, productDetails });

    // Validate input
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!productDetails) {
      return res.status(400).json({ message: 'Product details are required' });
    }

    // Find or create product in database
    let product = await Product.findOne({ externalId: productId.toString() });
    
    if (!product) {
      console.log('🆕 Creating new product in database');
      product = new Product({
        name: productDetails.title || productDetails.name || 'Unknown Product',
        price: parseFloat(productDetails.price) || 0,
        image: productDetails.thumbnail || productDetails.image || '',
        description: productDetails.description || '',
        category: productDetails.category || 'general',
        stock: productDetails.stock || 100,
        externalId: productId.toString()
      });
      await product.save();
      console.log('✅ Product created in database:', product._id);
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      console.log('🆕 Creating new cart for user');
      cart = new Cart({ user: userId, items: [] });
    }

    // ✅ SAFE: Clean up any invalid items in cart first
    if (cart.items && cart.items.length > 0) {
      cart.items = cart.items.filter(item => {
        return item && item.product && item.product !== null;
      });
    } else {
      cart.items = [];
    }

    // ✅ SAFE: Check if product already in cart using SAFE comparison
    let existingItemIndex = -1;
    
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      
      // Safely check if this item matches our product
      if (item && item.product) {
        try {
          if (safeObjectIdEquals(item.product, product._id)) {
            existingItemIndex = i;
            break;
          }
        } catch (comparisonError) {
          console.log('⚠️ Error comparing product IDs:', comparisonError.message);
          continue;
        }
      }
    }

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += parseInt(quantity);
      console.log('📈 Updated existing item quantity');
    } else {
      // Add new item to cart
      cart.items.push({
        product: product._id, // Use ObjectId directly
        quantity: parseInt(quantity)
      });
      console.log('➕ Added new item to cart');
    }

    await cart.save();
    console.log('✅ Cart updated successfully');

    res.status(201).json({ 
      message: 'Item added to cart successfully',
      itemCount: cart.items.length,
      productId: product._id,
      productName: product.name
    });

  } catch (error) {
    console.error('❌ Add to cart error:', error);
    res.status(500).json({ 
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
});

// PUT /api/cart/update - Update item quantity
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;

    if (!itemId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid item ID and quantity required' });
    }

    console.log('🔄 Updating cart quantity:', { userId, itemId, quantity });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clean up invalid items
    cart.items = cart.items.filter(item => item && item.product && item.product !== null);

    const itemIndex = cart.items.findIndex(item => {
      if (!item || !item._id) return false;
      try {
        return safeObjectIdEquals(item._id, itemId);
      } catch (error) {
        return false;
      }
    });

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = parseInt(quantity);
    await cart.save();

    console.log('✅ Cart quantity updated successfully');
    res.json({ message: 'Cart updated successfully' });

  } catch (error) {
    console.error('❌ Update cart error:', error);
    res.status(500).json({ message: 'Failed to update cart' });
  }
});

// DELETE /api/cart/remove/:itemId - Remove item from cart
router.delete('/remove/:itemId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    console.log('🗑️ Removing item from cart:', { userId, itemId });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const initialLength = cart.items.length;
    
    // Remove the item and filter out any invalid items
    cart.items = cart.items.filter(item => {
      if (!item || !item._id || !item.product) return false;
      try {
        return !safeObjectIdEquals(item._id, itemId);
      } catch (error) {
        return false;
      }
    });

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cart.save();
    console.log('✅ Item removed from cart successfully');

    res.json({ 
      message: 'Item removed from cart successfully',
      itemCount: cart.items.length 
    });

  } catch (error) {
    console.error('❌ Remove from cart error:', error);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
});

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    console.log('✅ Cart cleared successfully');
    res.json({ message: 'Cart cleared successfully' });

  } catch (error) {
    console.error('❌ Clear cart error:', error);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

module.exports = router;

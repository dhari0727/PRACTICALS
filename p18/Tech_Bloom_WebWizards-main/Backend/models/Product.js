const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true 
  },
  description: { 
    type: String, 
    default: ''
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required'],
    min: [0, 'Price must be positive']
  },
  image: { 
    type: String, 
    required: [true, 'Product image is required']
  },
  category: { 
    type: String, 
    required: [true, 'Product category is required']
  },
  stock: { 
    type: Number, 
    default: 100,
    min: [0, 'Stock cannot be negative']
  },
  externalId: { 
    type: String, // For DummyJSON product IDs
    unique: true,
    sparse: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Product', ProductSchema);

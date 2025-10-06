const mongoose = require('mongoose');
  const { Schema } = mongoose;
  
  const OrderSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      }
    }],
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      // Support existing values and new admin portal states
      enum: ['pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled', 'canceled', 'refunded'],
      default: 'pending'
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'online'],
      default: 'cod'
    },
    orderDate: {
      type: Date,
      default: Date.now
    }
  }, { timestamps: true });

// helpful indexes for admin queries
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ 'shippingAddress.email': 1 });

  module.exports = mongoose.model('Order', OrderSchema);

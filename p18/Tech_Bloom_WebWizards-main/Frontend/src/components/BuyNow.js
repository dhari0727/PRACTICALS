import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// styles consolidated into App.css

function BuyNow() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Review order, 2: Address & Payment
  const [placingOrder, setPlacingOrder] = useState(false);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cod'
  });

  useEffect(() => {
    if (productId === 'cart-checkout') {
      // Handle cart checkout
      const checkoutData = sessionStorage.getItem('checkoutData');
      if (checkoutData) {
        setOrderData(JSON.parse(checkoutData));
        setLoading(false);
      } else {
        navigate('/cart');
      }
    } else {
      // Handle single product purchase
      fetchProductData();
    }
  }, [productId, navigate]);

  const fetchProductData = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/products/${productId}`);
      const product = await response.json();
      
      setOrderData({
        items: [{
          _id: product.id,
          name: product.title,
          price: product.price,
          image: product.thumbnail,
          quantity: 1,
          subtotal: product.price.toFixed(2)
        }],
        total: product.price,
        type: 'single_product'
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Product not found');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { fullName, email, phone, address, city, state, zipCode } = shippingInfo;
    if (!fullName || !email || !phone || !address || !city || !state || !zipCode) {
      alert('Please fill all required fields');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      alert('Please enter a valid 10-digit phone number');
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setPlacingOrder(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to place your order');
        navigate('/login');
        return;
      }

      if (orderData.type === 'cart_checkout') {
        // Place order for multiple items from cart
        for (const item of orderData.items) {
          await axios.post('http://localhost:5000/api/orders', {
            productId: item.externalId || item.product,
            quantity: item.quantity,
            price: item.price,
            totalPrice: parseFloat(item.subtotal),
            shippingAddress: shippingInfo,
            paymentMethod: shippingInfo.paymentMethod,
            productDetails: {
              title: item.name,
              image: item.image,
              description: item.description,
              category: item.category
            }
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        
        // Clear cart after successful order
        await axios.delete('http://localhost:5000/api/cart/clear', {
          headers: { Authorization: `Bearer ${token}` }
        });

        sessionStorage.removeItem('checkoutData');
        alert('All orders placed successfully! 🎉');
      } else {
        // Place single product order
        const item = orderData.items[0];
        await axios.post('http://localhost:5000/api/orders', {
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          totalPrice: orderData.total,
          shippingAddress: shippingInfo,
          paymentMethod: shippingInfo.paymentMethod,
          productDetails: {
            title: item.name,
            image: item.image
          }
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert('Order placed successfully! 🎉');
      }

      navigate('/orders');
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="buynow-container">
        <div className="loading">
          <h2>Loading checkout...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="buynow-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="buynow-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span> Review Order
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span> Shipping & Payment
          </div>
        </div>
      </div>

      {step === 1 ? (
        <div className="order-review">
          <div className="order-items">
            <h3>Order Items:</h3>
            {orderData.items.map((item, index) => (
              <div key={index} className="checkout-item">
                <div className="item-image">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    onError={(e) => e.target.src = '/placeholder-image.jpg'}
                  />
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Price: &#8377;{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p className="subtotal">Subtotal: &#8377;{item.subtotal}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h3>Total: &#8377;{orderData.total.toFixed(2)}</h3>
            <button 
              onClick={() => setStep(2)} 
              className="btn-continue"
            >
              Continue to Shipping
            </button>
          </div>
        </div>
      ) : (
        <div className="shipping-payment">
          <div className="form-section">
            <h3>Shipping Address</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit phone number"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  placeholder="Enter your complete address"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  required
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleInputChange}
                  placeholder="Enter your state"
                  required
                />
              </div>

              <div className="form-group">
                <label>ZIP/Postal Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleInputChange}
                  placeholder="Enter ZIP code"
                  required
                />
              </div>
            </div>
          </div>

          <div className="payment-section">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={shippingInfo.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                />
                <div className="option-details">
                  <strong>💰 Cash on Delivery</strong>
                  <span>Pay when your order arrives</span>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={shippingInfo.paymentMethod === 'online'}
                  onChange={handleInputChange}
                />
                <div className="option-details">
                  <strong>💳 Online Payment</strong>
                  <span>Pay now with card/UPI (Coming Soon)</span>
                </div>
              </label>
            </div>
          </div>

          <div className="checkout-actions">
            <button 
              onClick={() => setStep(1)} 
              className="btn-back"
            >
              Back to Review
            </button>
            
            <div className="order-total">
              <strong>Total: &#8377;{orderData.total.toFixed(2)}</strong>
            </div>

            <button 
              onClick={handlePlaceOrder}
              className={`btn-place-order ${placingOrder ? 'placing' : ''}`}
              disabled={placingOrder}
            >
              {placingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyNow;

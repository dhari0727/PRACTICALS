import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// styles consolidated into App.css

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view your orders');
        setLoading(false);
        navigate('/login');
        return;
      }

      console.log('📋 Fetching orders...');
      
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Orders received:', response.data);
      
      setOrders(response.data.orders || []);
      setLoading(false);

    } catch (err) {
      console.error('❌ Failed to fetch orders:', err);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load orders. Please try again.');
      }
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId, orderNumber) => {
    const confirmMessage = `Are you sure you want to cancel Order #${orderNumber}? This action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setCancelling(prev => ({ ...prev, [orderId]: true }));

    try {
      const token = localStorage.getItem('token');
      
      console.log('🚫 Cancelling order:', orderId);
      
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Order cancelled successfully:', response.data);

      // Update local state to reflect the cancelled status
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        )
      );

      setCancelling(prev => ({ ...prev, [orderId]: false }));
      alert('✅ Order cancelled successfully!');

    } catch (err) {
      console.error('❌ Failed to cancel order:', err);
      
      const errorMessage = err.response?.data?.message || 'Failed to cancel order';
      alert(`❌ Error: ${errorMessage}`);
      
      setCancelling(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#007bff';
      case 'shipped': return '#6f42c1';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const canCancelOrder = (status) => {
    const cancelableStatuses = ['pending', 'confirmed'];
    return cancelableStatuses.includes(status.toLowerCase());
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">
          <h2>Loading your orders...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error">
          <h2>Error Loading Orders</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <p className="orders-count">
          {orders.length === 0 ? 'No orders found' : `${orders.length} order(s) found`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">📋</div>
          <h3>No orders yet!</h3>
          <p>You haven't placed any orders. Start shopping to see your orders here.</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderNumber}</h3>
                  <p className="order-date">
                    Placed on {new Date(order.createdAt || order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-status">
                  <span 
                    className={`status-badge ${order.status.toLowerCase()}`}
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items ({order.products?.length || 0}):</h4>
                {order.products?.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      <img 
                        src={item.product?.image || '/placeholder-image.jpg'} 
                        alt={item.product?.name || 'Product'}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <div className="item-details">
                      <span className="item-name">
                        {item.product?.name || 'Product Name'}
                      </span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </div>
                    <div className="item-price">
                      &#8377;{(item.product?.price || item.price || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <div className="order-total">
                  <strong>Total: &#8377;{order.totalPrice.toFixed(2)}</strong>
                </div>
                <div className="order-actions">
                  {canCancelOrder(order.status) && (
                    <button 
                      className={`btn-cancel ${cancelling[order._id] ? 'cancelling' : ''}`}
                      onClick={() => cancelOrder(order._id, order.orderNumber)}
                      disabled={cancelling[order._id]}
                    >
                      {cancelling[order._id] ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                  {order.status.toLowerCase() === 'cancelled' && (
                    <span className="cancelled-text">Order has been cancelled</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;

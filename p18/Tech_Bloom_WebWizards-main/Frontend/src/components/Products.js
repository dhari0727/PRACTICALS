import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// styles consolidated into App.css
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/products');
      const data = await response.json();
      setProducts(data.products || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        // Guest cart using localStorage
        let guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');

        const existing = guestCart.find(item => item.id === product.id);
        if (existing) {
          existing.quantity += 1;
          existing.subtotal = existing.quantity * product.price;
        } else {
          guestCart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            subtotal: product.price,
            image: product.thumbnail,
            description: product.description,
            category: product.category,
          });
        }

        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
        alert(`✅ ${product.title} added to cart successfully!`);
        return;
      }

      // Logged-in user — API call
      setAddingToCart(prev => ({ ...prev, [product.id]: true }));

      const response = await axios.post('http://localhost:5000/api/cart/add', {
        productId: product.id.toString(),
        quantity: 1,
        productDetails: {
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          description: product.description,
          category: product.category,
          stock: product.stock || 100
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert(`✅ ${product.title} added to cart successfully!`);

    } catch (error) {
      console.error('Add to cart error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to add to cart';
        alert(`❌ Error: ${errorMessage}`);
      }
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleBuyNow = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to purchase products');
      navigate('/login');
      return;
    }
    
    navigate(`/buy-now/${product.id}`);
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="spinner"></div>
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <h2>Error Loading Products</h2>
        <p>{error}</p>
        <button onClick={fetchProducts} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header"></div>

      <div className="product-grid">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              <img 
                src={product.thumbnail} 
                alt={product.title}
                onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
              />
              {product.discountPercentage && 
                <div className="product-badge">
                  {Math.round(product.discountPercentage)}% OFF
                </div>
              }
            </div>

            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-description">
                {product.description?.slice(0, 80)}...
              </p>
              
              <div className="product-details">
                <span className="product-category">
                  Category: {product.category}
                </span>
                <span className="product-rating">
                  ⭐ {product.rating || 'N/A'}
                </span>
              </div>

              <div className="product-price">
                <span className="current-price">₹{product.price}</span>
                {product.discountPercentage && (
                  <span className="original-price">
                    ₹{(product.price / (1 - product.discountPercentage/100)).toFixed(0)}
                  </span>
                )}
              </div>

              <div className="product-stock">
                <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            <div className="card-actions">
              <button 
                className="buy-btn"
                onClick={() => handleBuyNow(product)}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
              
              <button 
                className={`cart-btn ${addingToCart[product.id] ? 'loading' : ''}`}
                onClick={() => handleAddToCart(product)}
                disabled={addingToCart[product.id] || product.stock === 0}
              >
                {addingToCart[product.id] ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="no-products">
          <h3>No products available</h3>
          <p>Please check back later!</p>
        </div>
      )}
    </div>
  );
}

export default Products;

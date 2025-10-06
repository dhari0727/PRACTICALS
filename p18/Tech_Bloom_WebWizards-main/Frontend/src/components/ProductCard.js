import React from 'react';
import axios from 'axios';

function ProductCard({ product }) {
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to add items to cart');
        return;
      }

      const res = await axios.post('http://localhost:5000/api/cart/add', {
        productId: product._id,
        quantity: 1
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert('Product added to cart!');
      console.log('Added to cart:', res.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const imageSrc = product.image || product.thumbnail || product.thumbnailUrl || product.photos && product.photos[0] || '';

  return (
    <div className="product-card card">
      {imageSrc ? (
        <div className="product-image"><img src={imageSrc} alt={product.name || product.title} /></div>
      ) : null}
      <div className="product-info">
        <h3 className="product-title">{product.name || product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">
          <div className="current-price">${product.price}</div>
        </div>
        <div className="card-actions">
          <button onClick={handleAddToCart} className="buy-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

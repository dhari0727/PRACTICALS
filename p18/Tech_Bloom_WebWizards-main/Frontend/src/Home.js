import React from 'react';
import { useNavigate } from 'react-router-dom';
// styles consolidated into App.css

function Home() {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    navigate('/products');
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-inner container">
          <div className="hero-center">
            <h1 className="hero-title">Welcome to<br/>ShopEase</h1>
            <p className="hero-sub">
              Discover the best deals on electronics, fashion, home essentials, and more.
              Enjoy a seamless shopping experience with fast delivery and secure payments.
            </p>

            {/* Centered CTA */}
            <div className="hero-ctas">
              <button className="shop-now" onClick={handleShopNowClick}>Shop Now</button>
            </div>
          </div>

          {/* Feature cards below the hero text */}
          <div className="features-row">
            <div className="feature-card">
              <span className="icon" role="img" aria-label="truck">🚚</span>
              <h3>Fast Delivery</h3>
              <p>Get your orders delivered quickly and safely to your doorstep.</p>
            </div>

            <div className="feature-card">
              <span className="icon" role="img" aria-label="lock">🔒</span>
              <h3>Secure Payments</h3>
              <p>Multiple payment options with 100% security for your peace of mind.</p>
            </div>

            <div className="feature-card">
              <span className="icon" role="img" aria-label="star">⭐</span>
              <h3>Top Brands</h3>
              <p>Shop from a wide range of top brands and quality products.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

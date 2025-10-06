import React from 'react';
// styles consolidated into App.css

function About() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About ShopEase</h1>
        <p className="about-subtitle">Your trusted e-commerce partner since 2025</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Welcome to ShopEase, your one-stop destination for all your shopping needs! 
            Founded with a vision to make online shopping simple, secure, and enjoyable, 
            we've been committed to providing exceptional service and quality products 
            to customers worldwide.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to revolutionize the e-commerce experience by offering:
          </p>
          <ul>
            <li>Wide variety of high-quality products at competitive prices</li>
            <li>Seamless and user-friendly shopping experience</li>
            <li>Fast and reliable delivery services</li>
            <li>Outstanding customer support</li>
            <li>Secure payment processing and data protection</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Why Choose ShopEase?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🛍️ Vast Product Range</h3>
              <p>From electronics to groceries, fashion to home essentials - we have it all!</p>
            </div>
            <div className="feature-card">
              <h3>🚚 Fast Delivery</h3>
              <p>Quick and reliable shipping with real-time order tracking.</p>
            </div>
            <div className="feature-card">
              <h3>💳 Secure Payments</h3>
              <p>Multiple payment options with bank-level security encryption.</p>
            </div>
            <div className="feature-card">
              <h3>🏆 Quality Assurance</h3>
              <p>Rigorous quality checks and authentic products guaranteed.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Values</h2>
          <div className="values-container">
            <div className="value-item">
              <strong>Customer First:</strong> Your satisfaction is our top priority
            </div>
            <div className="value-item">
              <strong>Innovation:</strong> Continuously improving our platform and services
            </div>
            <div className="value-item">
              <strong>Trust:</strong> Building lasting relationships through transparency
            </div>
            <div className="value-item">
              <strong>Excellence:</strong> Delivering exceptional quality in everything we do
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Contact Information</h2>
          <div className="contact-info">
            <p><strong>Address:</strong> 123 Commerce Street, Tech City, TC 12345</p>
            <p><strong>Phone:</strong> +1 (555) 123-SHOP</p>
            <p><strong>Email:</strong> support@shopease.com</p>
            <p><strong>Hours:</strong> Monday - Friday: 9 AM - 6 PM (EST)</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;

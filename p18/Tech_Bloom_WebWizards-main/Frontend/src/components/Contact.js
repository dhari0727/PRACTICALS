import React, { useState } from 'react';
// styles consolidated into App.css

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="contact-container">
        <div className="success-message">
          <h2>✅ Message Sent Successfully!</h2>
          <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
          <button 
            onClick={() => setIsSubmitted(false)} 
            className="shop-now"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch with us!</p>
      </div>

      <div className="contact-content">
        <div className="contact-info-section">
          <h2>Get in Touch</h2>
          
          <div className="contact-methods">
            <div className="contact-method">
              <div className="contact-icon">📧</div>
              <div className="contact-details">
                <h3>Email Us</h3>
                <p>support@shopease.com</p>
                <p>business@shopease.com</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h3>Call Us</h3>
                <p>Customer Support: +1 (555) 123-SHOP</p>
                <p>Business Inquiries: +1 (555) 456-BUSI</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">📍</div>
              <div className="contact-details">
                <h3>Visit Us</h3>
                <p>123 Commerce Street</p>
                <p>Tech City, TC 12345</p>
                <p>United States</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">🕒</div>
              <div className="contact-details">
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9 AM - 6 PM EST</p>
                <p>Saturday: 10 AM - 4 PM EST</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Customer Support</option>
                  <option value="business">Business Partnership</option>
                  <option value="feedback">Feedback/Suggestion</option>
                  <option value="complaint">Complaint</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                placeholder="Enter your message here..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="shop-now"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;

import React from 'react';
// styles consolidated into App.css

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <div className="logo">ShopEase</div>
          <p className="text-muted">Modern e-commerce demo · Built with React</p>
        </div>
        <div className="footer-right">
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/terms">Terms</a>
          </div>
          <div className="copyright">© {new Date().getFullYear()} ShopEase. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

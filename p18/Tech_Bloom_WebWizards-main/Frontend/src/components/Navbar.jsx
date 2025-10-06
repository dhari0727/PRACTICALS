import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);

  // --- Helper for guest cart ---
  const getGuestCart = () => JSON.parse(localStorage.getItem('guest_cart') || '[]');

  // --- Fetch cart count and user profile ---
  useEffect(() => {
    updateCartCount();
    if (user) fetchUserProfile();

    // Listen for guest cart changes in other tabs
    const handleStorageChange = () => updateCartCount();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // Fetch logged-in user's profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(response.data.user);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  // Fetch cart count (API for logged-in or localStorage for guest)
  const updateCartCount = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItemCount(response.data.itemCount || 0);
      } catch (err) {
        console.error('Failed to fetch cart count:', err);
      }
    } else {
      const guestCart = getGuestCart();
      const count = guestCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartItemCount(count);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserProfile(null);
    setCartItemCount(0);
    navigate('/');
  };

  const handleProfileClick = () => navigate('/profile');

  const navbarStyle = {
    backgroundColor: 'var(--footer-bg)',
    color: 'var(--text)',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const logoStyle = { fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', textDecoration: 'none' };
  const linksContainerStyle = { display: 'flex', alignItems: 'center', gap: '2rem' };
  const navLinksStyle = { display: 'flex', alignItems: 'center', gap: '1.5rem' };
  const linkStyle = { color: 'var(--muted)', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 700 };
  const authSectionStyle = { display: 'flex', alignItems: 'center', gap: '1rem' };
  const buttonStyle = { backgroundColor: 'var(--accent)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: '800' };
  const cartButtonStyle = { ...buttonStyle, position: 'relative' };
  const logoutButtonStyle = { ...buttonStyle, backgroundColor: 'var(--danger)' };
  const signupButtonStyle = { ...buttonStyle, backgroundColor: 'var(--accent-2)', color: 'var(--text)' };
  const badgeStyle = { position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'var(--danger)', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid var(--footer-bg)' };

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={logoStyle}>ShopEase</Link>
      <div style={linksContainerStyle}>
        <div style={navLinksStyle}>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/products" style={linkStyle}>Products</Link>
          <Link to="/about" style={linkStyle}>About</Link>
          <Link to="/contact" style={linkStyle}>Contact</Link>
        </div>
        <div style={authSectionStyle}>
          <Link to="/cart" style={cartButtonStyle}>
            Cart {cartItemCount > 0 && <span style={badgeStyle}>{cartItemCount}</span>}
          </Link>

          {user ? (
            <>
              <button onClick={handleProfileClick} style={buttonStyle}>{userProfile?.name || user?.name || 'Profile'}</button>
              <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={buttonStyle}>Login</Link>
              <Link to="/register" style={signupButtonStyle}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

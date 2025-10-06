import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './Home';
import Products from './components/Products';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile'; // Add this import
import './App.css';
import Cart from './components/Cart';
import BuyNow from './components/BuyNow';
import Orders from './components/Orders';
import About from './components/About';
import Contact from './components/Contact';
import AdminLogin from './admin/AdminLogin';
import AdminOrders from './admin/AdminOrders';
import AdminOrderDetail from './admin/AdminOrderDetail';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedAdminRoute from './admin/ProtectedAdminRoute';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null); // Track user login state
  const [loading, setLoading] = useState(true); // Loading state for initial user fetch

  // Fetch user data when app loads
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching user data on app load...');
        
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ User data fetched:', response.data.user);
        setUser(response.data.user);
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Failed to fetch user:', error);
        
        // If token is invalid, remove it and set user to null
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Empty dependency array - only run once on mount

  // Show loading screen while fetching user data
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/buy-now/:productId" element={<BuyNow />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} /> {/* Add profile route */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedAdminRoute>
            <AdminOrders />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/orders/:id" element={
          <ProtectedAdminRoute>
            <AdminOrderDetail />
          </ProtectedAdminRoute>
        } />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

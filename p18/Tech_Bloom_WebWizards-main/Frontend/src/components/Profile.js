import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// styles consolidated into App.css

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view profile');
        setLoading(false);
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(response.data.user || response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load profile');
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">
          <h2>Loading your profile...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <h1>Welcome, {user?.name || 'User'}!</h1>
            <p>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <div className="profile-view">
            <div className="view-header">
              <h2>Profile Information</h2>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <strong>Full Name:</strong>
                <span>{user?.name || 'Not provided'}</span>
              </div>
              
              <div className="info-item">
                <strong>Email Address:</strong>
                <span>{user?.email || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

import axios from 'axios';

const API_ADMIN = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
});

// Attach admin token
API_ADMIN.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API_ADMIN;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// styles consolidated into App.css

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    try {
      // adjust the URL if needed
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      setMsg(res.data.msg || 'Registration successful! Please login.');
      // Optionally redirect to login in 2s
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        err.response?.data?.error ||
        'Error registering. Please try again.'
      );
    }
  };

  return (
    <div className="auth-panel">
      <h2>Register</h2>
      <p>Create your account to get started</p>
      {msg && <div className="message success-message">{msg}</div>}
      {error && <div className="message error-message">{error}</div>}
      <form onSubmit={onSubmit} className="auth-form">
        <div className="form-group">
          <label>Name</label>
          <input className="input" name="name" placeholder="Name" value={form.name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        </div>
        <div className="auth-actions">
          <button type="submit" className="auth-cta auth-primary">Sign Up</button>
          <button type="button" className="auth-cta auth-secondary" onClick={() => navigate('/login')}>Have an account?</button>
        </div>
      </form>
    </div>
  );
}

export default Register;

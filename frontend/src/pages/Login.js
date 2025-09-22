import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);

      localStorage.setItem('user', JSON.stringify({
        name: res.data.name,
        email: form.email 
      }));

      alert('✅ Login successful!');
      window.location.href = '/';
    } catch (err) {
      const msg = err.response?.data?.msg || err.message;
      alert('❌ Login failed: ' + msg);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        background: 'white',
        padding: '30px 40px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '350px'
      }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>🔐 Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Login</button>
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            <a href="/forgot-password" style={{ color: '#007bff' }}>Forgot Password?</a>
          </p>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '16px'
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  cursor: 'pointer'
};

export default Login;

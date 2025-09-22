import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      if (res.data.isAdmin) {
        localStorage.setItem('isAdmin', 'true');
      } else {
        localStorage.setItem('isAdmin', 'false');
      }

      alert('✅ Admin login successful');
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Admin login failed:', err);
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>🛡️ Admin Login</h2>
        <form onSubmit={handleAdminLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: '#f0f4f8',
  fontFamily: 'Times New Roman, serif'
};

const cardStyle = {
  background: '#fff',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 0 10px rgba(0,0,0,0.2)',
  width: '320px',
  textAlign: 'center'
};

const titleStyle = {
  marginBottom: '20px',
  color: '#333',
  fontSize: '24px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontFamily: 'Times New Roman, serif',
  fontSize: '16px'
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontFamily: 'Times New Roman, serif'
};

export default AdminLogin;

import React, { useState } from 'react';
import './LoginPage.css'; 
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('✅ Logged in successfully!');
    localStorage.setItem('token', 'dummy'); 
    navigate('/services'); 
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <h2>Welcome Back,</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit">LOGIN</button>
          </form>
          <button onClick={() => navigate('/')} className="home-btn">HOME</button>
        </div>
        <div className="login-right">
          <h3>Ready to embark on an amazing journey?</h3>
          <p>Click here and Sign Up if you're not part of our family yet!</p>
          <button onClick={() => navigate('/register')} className="signup-btn">SIGN UP</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

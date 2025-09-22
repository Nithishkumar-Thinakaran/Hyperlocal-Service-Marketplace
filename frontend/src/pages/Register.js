import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('✅ OTP sent to your email. Please verify.');
      setOtpSent(true);
    } catch (err) {
      alert('❌ Registration failed: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email: form.email,
        otp
      });
      alert('✅ OTP verified. You can now login.');
      window.location.href = '/login'; // redirect to login
    } catch (err) {
      alert('❌ OTP verification failed: ' + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '50px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '10px', background: 'linear-gradient(to right, #f9f9f9, #e3f2fd)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2' }}>Register</h2>
      {!otpSent ? (
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input name="name" placeholder="Name" onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input name="email" placeholder="Email" type="email" onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input name="password" placeholder="Password" type="password" onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />

          <button type="submit" style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#1976d2', color: 'white', border: 'none', cursor: 'pointer' }}>Register</button>
        </form>
      ) : (
        <form onSubmit={handleOtpVerify} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#388e3c', color: 'white', border: 'none', cursor: 'pointer' }}>Verify OTP</button>
        </form>
      )}
    </div>
  );
}

export default Register;
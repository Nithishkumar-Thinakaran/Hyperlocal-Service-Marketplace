import React, { useState } from 'react';
import axios from 'axios';

function ResetPassword() {
  const [form, setForm] = useState({
    email: '',
    otp: '',
    newPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', form);
      alert('✅ Password reset successful! You can now login.');
      window.location.href = '/login';
    } catch (err) {
      const msg = err.response?.data?.msg || err.message;
      alert('❌ Failed to reset password: ' + msg);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Registered Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="otp"
          type="text"
          placeholder="4-digit OTP"
          value={form.otp}
          onChange={handleChange}
          required
        />
        <input
          name="newPassword"
          type="password"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;

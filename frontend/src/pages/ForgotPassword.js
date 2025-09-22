import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
const [email, setEmail] = useState('');
const [step, setStep] = useState(1);
const [otp, setOtp] = useState('');
const [newPassword, setNewPassword] = useState('');

const handleRequestOtp = async (e) => {
e.preventDefault();
try {
await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
alert('✅ OTP sent to your email.');
setStep(2);
} catch (err) {
alert('❌ Failed to send OTP: ' + (err.response?.data?.msg || err.message));
}
};

const handleResetPassword = async (e) => {
e.preventDefault();
try {
await axios.post('http://localhost:5000/api/auth/reset-password', {
email,
otp,
newPassword
});
alert('✅ Password reset successful. You can now login.');
window.location.href = '/login';
} catch (err) {
alert('❌ Reset failed: ' + (err.response?.data?.msg || err.message));
}
};

return (
<div style={{ maxWidth: '400px', margin: '40px auto' }}>
<h2>Forgot Password</h2>
{step === 1 ? (
<form onSubmit={handleRequestOtp}>
<input
type="email"
placeholder="Enter your registered email"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
/>
<button type="submit">Send OTP</button>
</form>
) : (
<form onSubmit={handleResetPassword}>
<input
type="text"
placeholder="Enter OTP"
value={otp}
onChange={(e) => setOtp(e.target.value)}
required
/>
<input
type="password"
placeholder="Enter new password"
value={newPassword}
onChange={(e) => setNewPassword(e.target.value)}
required
/>
<button type="submit">Reset Password</button>
</form>
)}
</div>
);
}

export default ForgotPassword;
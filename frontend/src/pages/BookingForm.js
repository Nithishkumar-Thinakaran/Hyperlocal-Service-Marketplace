import React, { useState, useEffect } from 'react';
import axios from 'axios';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
    } else {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    }
  });
}

function BookingForm({ serviceId, onBooked }) {
  const [date, setDate] = useState('');
  const [user, setUser] = useState({ name: '', email: '' });

  // Calculate the minimum booking date (tomorrow)
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser({ name: storedUser.name, email: storedUser.email });
    }
  }, []);

  const handlePaymentAndBooking = async () => {
    if (!date) {
      alert('Please select a date.');
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const token = localStorage.getItem('token');

    const amount = 50000; 

    const options = {
      key: 'rzp_test_jMKRgDZqovABjo',
      amount,
      currency: 'INR',
      name: 'Service Booking',
      description: 'Service Payment',
      handler: async function (response) {
        try {
          await axios.post('http://localhost:5000/api/bookings', {
            service: serviceId,
            date,
            razorpay_payment_id: response.razorpay_payment_id,
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          alert('✅ Booking successful!');
          onBooked();
        } catch (error) {
          console.error('Booking error:', error);
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <input
        type="date"
        value={date}
        min={getTomorrowDate()} // Booking starts from tomorrow
        onChange={e => setDate(e.target.value)}
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
      <button
        onClick={handlePaymentAndBooking}
        style={{
          padding: '8px 16px',
          marginLeft: '10px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Book
      </button>
    </div>
  );
}

export default BookingForm;

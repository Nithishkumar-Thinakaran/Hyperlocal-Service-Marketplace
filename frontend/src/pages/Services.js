import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import BookingForm from './BookingForm';

function Services({ setShowMockPayment }) {
  const [services, setServices] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/services')
      .then(res => setServices(res.data))
      .catch(err => console.error('Failed to load services:', err));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name);
      } catch (err) {
        console.error('JWT decode error:', err);
      }
    }
  }, []);

  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)',
      minHeight: '100vh'
    }}>
      {/* Hi, username gradient bar */}
      {userName && (
        <div
          style={{
            background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)',
            color: '#333',
            fontFamily: 'Times New Roman, serif',
            fontSize: '20px',
            padding: '10px 20px',
            borderBottom: '1px solid #ccc',
          }}    
        >
          Hi, {userName}
        </div>
      )}

      <div style={{ padding: '30px' }}>
        <h2 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px',
          fontSize: '28px'
        }}>
          💼 Available Services
        </h2>

        {services.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '18px' }}>No services found.</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {services.map(service => (
              <div
                key={service._id}
                style={{
                  background: '#fff',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                }}
              >
                <h3 style={{ color: '#4a148c', marginBottom: '10px' }}>{service.name}</h3>
                <p style={{ color: '#555', marginBottom: '8px' }}>{service.description}</p>
                <p style={{ fontWeight: 'bold', color: '#2e7d32' }}>Price: ₹{service.price}</p>
                <p style={{ fontStyle: 'italic', color: '#6d4c41' }}>Category: {service.category}</p>

                {localStorage.getItem('token') ? (
                  <BookingForm
                    serviceId={service._id}
                    onBooked={() => setShowMockPayment(true)}
                  />
                ) : (
                  <p style={{ color: '#888', fontSize: '14px', marginTop: '10px' }}>
                    🔒 Login to book this service
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;

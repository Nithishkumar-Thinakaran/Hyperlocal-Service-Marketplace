import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function Home() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
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
      minHeight: '100vh',
      background: 'linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      {/* Hi, username greeting bar */}
      {userName && (
        <div
          style={{
            position: 'absolute',
            top: '50px', 
            left: 0,
            right: 0,
            background: 'linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)',
            color: '#333',
            fontFamily: 'Times New Roman, serif',
            fontSize: '20px',
            padding: '10px 20px',
            borderBottom: '1px solid #ccc',
            textAlign: 'left'
          }}
        >
          Hi, {userName}
        </div>
      )}

      <h2 style={{ fontSize: '36px', color: '#333', marginBottom: '10px' }}>
        🎉 Welcome to Our Service Booking App
      </h2>
      <p style={{ fontSize: '20px', color: '#555', maxWidth: '600px', textAlign: 'center' }}>
        This is the home page. You can browse and book services using the navigation bar above. We hope you enjoy a smooth experience!
      </p>
    </div>
  );
}

export default Home;

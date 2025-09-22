import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Services from './pages/Services';
import AddService from './pages/AddService';
import Bookings from './pages/Bookings';
import MockPayment from './pages/MockPayment';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UpdateService from './pages/UpdateService';

function App() {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setLoggedIn(true);
        setUserName(decoded.name);
      } catch (err) {
        console.error('JWT decode error:', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setLoggedIn(false);
    setUserName('');
    window.location.href = '/login';
  };

  const linkStyle = {
    backgroundColor: '#fff',
    color: 'black',
    padding: '6px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginRight: '8px',
    display: 'inline-block',
    fontFamily: 'Times New Roman, serif',
    border: '1px solid black',
  };

  const logoutButtonStyle = {
    backgroundColor: '#fff',
    color: 'black',
    padding: '6px 12px',
    border: '1px solid black',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'Times New Roman, serif',
  };

  return (
    <>
      {/* Navbar */}
      <nav
        style={{
          padding: '10px',
          borderBottom: '1px solid #ccc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: isAdmin ? '#000' : '#fff',
        }}
      >
        <div>
          {!isAdmin && (
            <>
              <Link to="/" style={linkStyle}>Home</Link>
              {loggedIn && (
                <>
                  <Link to="/services" style={linkStyle}>Services</Link>
                  <Link to="/bookings" style={linkStyle}>Bookings</Link>
                </>
              )}
              {!loggedIn && (
                <>
                  <Link to="/register" style={linkStyle}>Register</Link>
                  <Link to="/login" style={linkStyle}>User Login</Link>
                </>
              )}
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin-dashboard" style={linkStyle}>Dashboard</Link>
              <Link to="/add-service" style={linkStyle}>Add Service</Link>
              <Link to="/update-service" style={linkStyle}>Update Service</Link>
            </>
          )}
        </div>

        <div>
          {(loggedIn || isAdmin) ? (
            <button onClick={handleLogout} style={logoutButtonStyle}>
              Logout
            </button>
          ) : (
            <Link to="/admin-login" style={linkStyle}>Admin Login</Link>
          )}
        </div>
      </nav>

  

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/mock-payment" element={<MockPayment />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/update-service" element={<UpdateService />} />
        <Route path="/admin-dashboard/edit-service/:id" element={<UpdateService />} />
      </Routes>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;

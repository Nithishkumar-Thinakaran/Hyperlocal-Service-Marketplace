import React, { useState } from 'react';
import axios from 'axios';

function AddService() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to add a service.');
      return;
    }

    const { name, description, price, category } = form;
    if (!name.trim() || !description.trim() || !price || !category.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/services',
        {
          name: name.trim(),
          description: description.trim(),
          price,
          category: category.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert('✅ Service added successfully!');
      setForm({ name: '', description: '', price: '', category: '' });
    } catch (err) {
      console.error('Add service failed:', err);
      alert('❌ Failed to add service: ' + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: '#000',
      padding: '40px 20px',
      fontFamily: 'Times New Roman, serif',
      color: '#fff'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#111',
        padding: '30px',
        borderRadius: '10px',
        border: '1px solid #00bcd4',
        boxShadow: '0 0 15px #00bcd4'
      }}>
        <h2 style={{
          color: 'white',
          textAlign: 'center',
          marginBottom: '25px'
        }}>
          Add New Service
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            name="name"
            placeholder="Service Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Add Service</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  backgroundColor: '#111',
  color: '#fff',
  border: '1px solid #00bcd4',
  borderRadius: '6px',
  fontSize: '16px'
};

const buttonStyle = {
  backgroundColor: '#00bcd4',
  color: '#000',
  border: 'none',
  borderRadius: '6px',
  padding: '12px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px'
};

export default AddService;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UpdateService() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/services');
      setServices(res.data);
    } catch (err) {
      alert('Error fetching services');
    }
  };

  const handleEditClick = (service) => {
    setEditingId(service._id);
    setEditForm({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category
    });
  };

  const handleChange = (e) => {
    setEditForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/services/${editingId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Service updated!');
      setEditingId(null);
      setEditForm({ name: '', description: '', price: '', category: '' });
      fetchServices();
    } catch (err) {
      alert('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Service deleted');
      fetchServices();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#000',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'Times New Roman, serif'
    }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}> Update Services</h2>

      <input
        type="text"
        placeholder="Search by service name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '5px',
          border: '1px solid #555',
          backgroundColor: '#222',
          color: '#fff',
          fontFamily: 'Times New Roman, serif'
        }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {filteredServices.map(service => (
          <div key={service._id} style={{
            backgroundColor: '#111',
            padding: '15px',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#00bcd4' }}>{service.name}</h3>
            <p>₹{service.price}</p>
            <p>{service.description}</p>
            <p><strong>Category:</strong> {service.category}</p>
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => handleEditClick(service)}
                style={{
                  backgroundColor: 'green',
                  color: '#000',
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '8px'
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(service._id)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div style={{
          marginTop: '30px',
          backgroundColor: '#111',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #333',
          maxWidth: '400px'
        }}>
          <h3 style={{ color: '#00bcd4' }}>✏️ Edit Service</h3>
          <input
            type="text"
            name="name"
            value={editForm.name}
            placeholder="Name"
            onChange={handleChange}
            style={inputStyle}
          /><br />
          <input
            type="text"
            name="description"
            value={editForm.description}
            placeholder="Description"
            onChange={handleChange}
            style={inputStyle}
          /><br />
          <input
            type="number"
            name="price"
            value={editForm.price}
            placeholder="Price"
            onChange={handleChange}
            style={inputStyle}
          /><br />
          <input
            type="text"
            name="category"
            value={editForm.category}
            placeholder="Category"
            onChange={handleChange}
            style={inputStyle}
          /><br />
          <div style={{ marginTop: '10px' }}>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: 'green',
                color: 'white',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              style={{
                backgroundColor: '#555',
                color: '#fff',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  margin: '6px 0',
  borderRadius: '5px',
  border: '1px solid #555',
  backgroundColor: '#222',
  color: '#fff',
  fontFamily: 'Times New Roman, serif'
};

export default UpdateService;

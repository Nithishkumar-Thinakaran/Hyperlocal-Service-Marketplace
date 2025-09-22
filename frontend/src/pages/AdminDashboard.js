import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatDate = (dateStr, includeTime = true) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return '-';
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  if (!includeTime) return `${day}/${month}/${year}`;

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
    } else {
      fetchBookings();
      fetchServices();
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.lastModifiedAt || b.createdAt) - new Date(a.lastModifiedAt || a.createdAt)
      );
      setBookings(sorted);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/services');
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const handleSort = (field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortField('');
      setSortOrder('');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '⇵';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getValueByField = (obj, field) => {
    if (field === 'date') {
      if (Array.isArray(obj.dateHistory) && obj.dateHistory.length > 0) {
        const latestEntry = obj.dateHistory[obj.dateHistory.length - 1];
        return new Date(latestEntry.date);
      }
      return new Date(obj.date);
    }
    if (field === 'rating') return obj.rating || 0;
    return '';
  };

  const sortedBookings = [...bookings];
  if (sortField) {
    sortedBookings.sort((a, b) => {
      const valA = getValueByField(a, sortField);
      const valB = getValueByField(b, sortField);
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }

  const filteredBookings = sortedBookings.filter((b) => {
    const statusMatch = !statusFilter || b.status === statusFilter;
    const serviceMatch = !serviceFilter || (b.service?.name || b.serviceName) === serviceFilter;
    const nameMatch = b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && serviceMatch && nameMatch;
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('User Bookings Report', 14, 15);

    const tableData = filteredBookings.map((b, index) => [
      index + 1,
      b.user?.name || '-',
      b.user?.email || '-',
      formatDate(b.createdAt),
      formatDate(getValueByField(b, 'date'), false),
      b.service?.name || b.serviceName || '-',
      b.status,
      b.rating || '-',
      b.feedback || '-'
    ]);

    autoTable(doc, {
      head: [['#', 'Name', 'Email', 'Booked On', 'Date', 'Service', 'Status', 'Rating', 'Feedback']],
      body: tableData,
      startY: 20,
    });

    doc.save('bookings-report.pdf');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'Times New Roman, serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#00bcd4' }}>📋 Admin Dashboard</h2>
        <button onClick={exportPDF} style={{ backgroundColor: '#00bcd4', color: '#000', padding: '5px 13px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Export PDF
        </button>
      </div>

      <h3>User Bookings</h3>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Search by name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={filterStyle} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={filterStyle}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} style={filterStyle}>
          <option value="">All Services</option>
          {services.map((s) => (
            <option key={s._id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: '10px', backgroundColor: '#111', padding: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#222' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Final Booking Confirmation</th>
              <th style={thStyle} onClick={() => handleSort('date')}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Booked on → Service Date {getSortIcon('date')}</th>
              <th style={thStyle}>Service</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle} onClick={() => handleSort('rating')}>Rating {getSortIcon('rating')}</th>
              <th style={thStyle}>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map(b => (
                <tr key={b._id} style={{ backgroundColor: b.status === 'completed' ? '#153f18' : b.status === 'cancelled' ? '#4d0000' : 'transparent' }}>
                  <td style={tdStyle}>{b.user?.name || '-'}</td>
                  <td style={tdStyle}>{b.user?.email || '-'}</td>
                  <td style={tdStyle}>{formatDate(b.createdAt)}</td>
                  <td style={tdStyle}>
                    {Array.isArray(b.dateHistory) && b.dateHistory.length > 0 ? (
                      <div>
                        {b.dateHistory.map((entry, index) => (
                          <div key={index} style={{ marginBottom: '3px' }}>
                            {formatDate(entry.bookedAt)} → {formatDate(entry.date, false)}{' '}
                            {entry.edited && (
                              <span style={{ fontStyle: 'italic', color: '#bbb' }}>(Modified)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      formatDate(b.date, false)
                    )}
                  </td>
                  <td style={tdStyle}>{b.service?.name || b.serviceName || '-'}</td>
                  <td style={tdStyle}>{b.status}</td>
                  <td style={tdStyle}>{b.rating || '-'}</td>
                  <td style={tdStyle}>{b.feedback || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '10px', color: '#aaa' }}>
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const filterStyle = {
  padding: '8px',
  backgroundColor: '#222',
  color: '#fff',
  border: '1px solid #555',
  borderRadius: '5px',
};

const thStyle = {
  padding: '12px 10px',
  textAlign: 'left',
  color: '#00bcd4',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const tdStyle = {
  padding: '10px',
  verticalAlign: 'top',
  borderBottom: '1px solid #333'
};

export default AdminDashboard;
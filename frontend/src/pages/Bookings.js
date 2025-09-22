import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import FeedbackModal from '../components/FeedbackModal';

function formatDisplayDate(dateStr) {
  const date = new Date(dateStr);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options).replace(/ /g, '/');
}

function formatDisplayDateTime(dateStr) {
  const date = new Date(dateStr);
  const options = { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  return date.toLocaleString('en-GB', options).replace(/ /g, '/').replace(',', '');
}

function getLatestBookedAt(history = []) {
  if (!Array.isArray(history) || history.length === 0) return null;
  return history.reduce((latest, curr) =>
    new Date(curr.bookedAt) > new Date(latest.bookedAt) ? curr : latest
  ).bookedAt;
}

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [userName, setUserName] = useState('');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [editingDateId, setEditingDateId] = useState(null);
  const [editedDate, setEditedDate] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name);

        axios.get('http://localhost:5000/api/bookings/', {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          const sorted = [...res.data].sort((a, b) =>
            new Date(b.editedDate || b.date) - new Date(a.editedDate || a.date)
          );
          setBookings(sorted);
        }).catch((err) => console.error('Failed to fetch bookings:', err));
      } catch (err) {
        console.error('JWT decode error:', err);
      }
    }
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.put(`http://localhost:5000/api/bookings/${id}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updated = bookings.map((b) =>
          b._id === id ? { ...b, status: 'cancelled' } : b
        );
        setBookings(updated);
      } catch (err) {
        console.error('Cancel failed:', err);
      }
    }
  };

  const handleComplete = (id) => {
    setSelectedBookingId(id);
    setShowModal(true);
  };

  const submitFeedback = async (rating, feedback) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${selectedBookingId}/complete`,
        { rating, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = bookings.map((b) =>
        b._id === selectedBookingId
          ? { ...b, status: 'completed', rating, feedback }
          : b
      );
      setBookings(updated);
      setShowModal(false);
      setSelectedBookingId(null);
    } catch (err) {
      console.error('Complete booking failed:', err);
    }
  };

  const handleEditDate = (id, currentDate) => {
    setEditingDateId(id);
    setEditedDate(currentDate.split('T')[0]);
  };

  const handleSaveDate = async (id) => {
    const today = new Date();
    const blockedDate = new Date(today);
    blockedDate.setDate(today.getDate() + 1);
    const selected = new Date(editedDate);

    if (selected <= blockedDate) {
      alert('You can only reschedule to a date at least 2 days after today.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/bookings/${id}/edit-date`,
        { date: editedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedBooking = response.data.booking;

      const updated = bookings.map((b) =>
        b._id === id
          ? {
              ...b,
              date: updatedBooking.date,
              editedDate: updatedBooking.editedDate,
              editCount: updatedBooking.editCount,
              dateHistory: updatedBooking.dateHistory,
              modified: true
            }
          : b
      );

      const sortedUpdated = [...updated].sort((a, b) =>
        new Date(b.editedDate || b.date) - new Date(a.editedDate || a.date)
      );

      setBookings(sortedUpdated);
      setEditingDateId(null);
      setEditedDate('');
    } catch (err) {
      console.error('Failed to save new date:', err);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.serviceName?.toLowerCase().includes(search.toLowerCase());
    const bookingDate = new Date(booking.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return matchesSearch && (!start || bookingDate >= start) && (!end || bookingDate <= end);
  });

  const categorize = (status) => filteredBookings.filter((b) => b.status === status);

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)', minHeight: '100vh' }}>
      {userName && (
        <div style={{ background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)', color: '#333', fontFamily: 'Times New Roman, serif', fontSize: '20px', padding: '10px 20px', borderBottom: '1px solid #ccc' }}>
          Hi, {userName}
        </div>
      )}

      <div style={{ padding: '30px' }}>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px', fontSize: '28px' }}>
          📝 Your Bookings
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Search by service name" value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', minWidth: '200px' }} />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {['pending', 'completed', 'cancelled'].map((status) => {
            const categoryBookings = categorize(status);
            return (
              <div key={status}>
                <h3 style={{ textAlign: 'center', color: status === 'completed' ? 'green' : status === 'cancelled' ? 'crimson' : '#555', marginBottom: '10px' }}>
                  {status === 'pending' && '🕒 Pending'}
                  {status === 'completed' && '✅ Completed'}
                  {status === 'cancelled' && '❌ Cancelled'}
                </h3>

                {categoryBookings.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#888' }}>No {status} bookings.</p>
                ) : (
                  categoryBookings.map((booking) => (
                    <div key={booking._id} style={{ background: status === 'completed' ? '#d0f0c0' : status === 'cancelled' ? '#fddede' : '#f9f9f9', padding: '20px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                      <p><strong>Service:</strong> {booking.serviceName}</p>
                      <p><strong>Date:</strong> {formatDisplayDate(booking.date)} {booking.editedDate && <span style={{ color: '#777', fontStyle: 'italic' }}>(modified)</span>}</p>
                      <p><strong>Booked On:</strong> {formatDisplayDateTime(getLatestBookedAt(booking.dateHistory) || booking.createdAt)}</p>
                      <p><strong>Price:</strong> ₹{booking.price}</p>

                      {status === 'completed' && (
                        <>
                          <p><strong>Rating:</strong> ⭐ {booking.rating}</p>
                          <p><strong>Feedback:</strong> {booking.feedback}</p>
                        </>
                      )}

                      {status === 'pending' && (
                        <>
                          <button onClick={() => handleComplete(booking._id)} style={{ marginRight: '10px', padding: '8px 12px', borderRadius: '5px', backgroundColor: '#4caf50', color: 'white', border: 'none', cursor: 'pointer' }}>
                            Service Done
                          </button>
                          <button onClick={() => handleCancel(booking._id)} style={{ marginRight: '10px', padding: '8px 12px', borderRadius: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>
                            Cancel Service
                          </button>
                          {(booking.editCount || 0) < 2 && (
                            editingDateId === booking._id ? (
                              <>
                                <input type="date" value={editedDate} onChange={(e) => setEditedDate(e.target.value)} style={{ marginRight: '5px', padding: '5px' }} />
                                <button onClick={() => handleSaveDate(booking._id)} style={{ backgroundColor: '#2196f3', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                              </>
                            ) : (
                              <button onClick={() => handleEditDate(booking._id, booking.date)} style={{ backgroundColor: '#2196f3', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit Date</button>
                            )
                          )}
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedBookingId && (
        <FeedbackModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedBookingId(null);
          }}
          onSubmit={submitFeedback}
        />
      )}
    </div>
  );
}

export default Bookings;

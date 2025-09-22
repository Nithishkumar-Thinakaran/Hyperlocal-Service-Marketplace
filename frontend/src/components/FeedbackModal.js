import React, { useState } from 'react';

const FeedbackModal = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleRating = (value) => setRating(value);

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating!');
      return;
    }
    onSubmit(rating, feedback);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Rate our service</h2>
        <p style={styles.text}>
          We highly value your feedback! Kindly take a moment to rate your experience and provide us with your valuable feedback.
        </p>
        <div style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                fontSize: '30px',
                cursor: 'pointer',
                color: rating >= star ? '#FFD700' : '#ccc',
              }}
              onClick={() => handleRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="Tell us about your experience!"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={styles.textarea}
        />
        <button onClick={handleSubmit} style={styles.button}>Send</button>
        <button onClick={onClose} style={styles.closeBtn}>X</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  },
  modal: {
    background: '#eef2ff',
    padding: '30px',
    borderRadius: '20px',
    width: '350px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    position: 'relative',
    textAlign: 'center',
  },
  title: { marginBottom: '10px', fontSize: '22px', color: '#333' },
  text: { fontSize: '14px', color: '#555', marginBottom: '15px' },
  stars: { marginBottom: '15px' },
  textarea: {
    width: '90%',
    height: '60px',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    resize: 'none',
    marginBottom: '15px',
    fontFamily: 'inherit',
  },
  button: {
    padding: '10px 25px',
    borderRadius: '20px',
    backgroundColor: '#FFD700',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    fontWeight: 'bold',
  },
  closeBtn: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#555',
  },
};

export default FeedbackModal;

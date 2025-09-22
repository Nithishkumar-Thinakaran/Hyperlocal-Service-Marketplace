const express = require('express');
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getAllBookings,
  completeBooking,
  cancelBooking,
  updateBookingDate
} = require('../controllers/bookingController');

const requireAuth = require('../middleware/requireAuth');

// User routes
router.post('/', requireAuth, createBooking);
router.get('/', requireAuth, getUserBookings);
router.put('/:id/complete', requireAuth, completeBooking);
router.put('/:id/cancel', requireAuth, cancelBooking);
router.put('/:id/edit-date', requireAuth, updateBookingDate);

// Admin route
router.get('/admin/all', requireAuth, getAllBookings);

module.exports = router;

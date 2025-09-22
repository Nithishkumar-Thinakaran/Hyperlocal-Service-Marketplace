const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');

exports.createBooking = async (req, res) => {
  try {
    const { service, date, razorpay_payment_id } = req.body;
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({ msg: 'Cannot book a past date!' });
    }

    const serviceData = await Service.findById(service);
    if (!serviceData) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    const booking = new Booking({
      user: req.user.id,
      service,
      serviceName: serviceData.name,
      servicePrice: serviceData.price,
      date: bookingDate,
      dateHistory: [{ bookedAt: new Date(), date: bookingDate, edited: false }],
      lastModifiedAt: new Date(),
      paymentId: razorpay_payment_id || null
    });

    await booking.save();
    res.status(201).json({ msg: 'Booking created', booking });
  } catch (err) {
    res.status(400).json({ msg: 'Booking failed', error: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('service');

    const formatted = bookings.map(b => {
      const latestHistory = b.dateHistory?.length ? b.dateHistory[b.dateHistory.length - 1] : null;
      return {
        _id: b._id,
        serviceName: b.service?.name || b.serviceName || 'Unknown',
        price: b.service?.price ?? b.servicePrice ?? 0,
        date: b.date,
        editedDate: b.editedDate || null,
        editCount: b.editCount || 0,
        dateHistory: b.dateHistory || [],
        status: b.status,
        rating: b.rating || null,
        feedback: b.feedback || '',
        bookedOn: latestHistory ? latestHistory.bookedAt : b.createdAt,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get bookings', error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found or unauthorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ msg: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to cancel booking', error: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const bookings = await Booking.find()
      .sort({ lastModifiedAt: -1 })
      .populate('user', 'name email')
      .populate('service', 'name price');

    const formatted = bookings.map(b => {
      const latestHistory = b.dateHistory?.length ? b.dateHistory[b.dateHistory.length - 1] : null;
      return {
        _id: b._id,
        user: b.user,
        service: b.service,
        serviceName: b.service?.name || b.serviceName || 'Unknown',
        servicePrice: b.service?.price ?? b.servicePrice ?? 0,
        date: b.date,
        editedDate: b.editedDate || null,
        editCount: b.editCount || 0,
        dateHistory: b.dateHistory || [],
        status: b.status,
        rating: b.rating || null,
        feedback: b.feedback || '',
        createdAt: latestHistory ? latestHistory.bookedAt : b.createdAt,
        paymentId: b.paymentId || null
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get all bookings', error: err.message });
  }
};

exports.completeBooking = async (req, res) => {
  const { rating, feedback } = req.body;

  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found or unauthorized' });
    }

    booking.status = 'completed';
    booking.rating = rating;
    booking.feedback = feedback;

    await booking.save();

    res.json({ msg: '✅ Service marked as done with feedback' });
  } catch (err) {
    console.error('❌ Mark done error:', err.message);
    res.status(500).json({ msg: 'Failed to update booking', error: err.message });
  }
};

exports.updateBookingDate = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found or unauthorized' });
    }

    if (booking.editCount >= 2) {
      return res.status(400).json({ msg: 'Booking date can only be edited twice' });
    }

    const newDate = new Date(req.body.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minAllowed = new Date(today);
    minAllowed.setDate(minAllowed.getDate() + 2);

    if (newDate < minAllowed) {
      return res.status(400).json({ msg: `Earliest reschedulable date is ${minAllowed.toDateString()}` });
    }

    booking.date = newDate;
    booking.editedDate = newDate;
    booking.editCount += 1;
    booking.lastModifiedAt = new Date();

    booking.dateHistory.push({
      bookedAt: new Date(),
      date: newDate,
      edited: true
    });

    await booking.save();
    res.json({ msg: 'Booking date updated', booking });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update date', error: err.message });
  }
};

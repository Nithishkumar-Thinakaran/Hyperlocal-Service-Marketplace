const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  serviceName: { type: String },
  servicePrice: { type: Number },
  date: Date,
  editedDate: { type: Date },
  editCount: { type: Number, default: 0 },
  lastModifiedAt: { type: Date }, 
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
  },

  dateHistory: [
    {
      bookedAt: {
        type: Date,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      edited: {
        type: Boolean,
        default: false,
      },
    },
  ],
}, { timestamps: true });

bookingSchema.virtual('latestBookedAt').get(function () {
  if (!this.dateHistory || this.dateHistory.length === 0) return this.createdAt;
  const latestEntry = this.dateHistory.reduce((latest, entry) =>
    !latest || entry.bookedAt > latest.bookedAt ? entry : latest
  , null);
  return latestEntry?.bookedAt || this.createdAt;
});

bookingSchema.set('toObject', { virtuals: true });
bookingSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Booking', bookingSchema);

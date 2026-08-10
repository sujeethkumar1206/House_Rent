const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    moveInDate: {
      type: Date,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending'
    },
    bookingStatus: {
      type: String,
      enum: ['Requested', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Requested'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);

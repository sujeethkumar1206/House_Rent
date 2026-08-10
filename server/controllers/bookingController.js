const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create a booking request for a property
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { property: propertyId, moveInDate } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    if (property.status !== 'Approved') {
      return res.status(400).json({ success: false, message: 'This property is not available for booking' });
    }
    if (property.owner.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot book your own property' });
    }

    const booking = await Booking.create({
      property: propertyId,
      user: req.user.id,
      owner: property.owner,
      moveInDate
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for logged-in user (as tenant, and as owner if they own listings)
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    const asTenant = await Booking.find({ user: req.user.id })
      .populate('property', 'title images price location city')
      .populate('owner', 'fullname email phone')
      .sort({ createdAt: -1 });

    const asOwner = await Booking.find({ owner: req.user.id })
      .populate('property', 'title images price location city')
      .populate('user', 'fullname email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, asTenant, asOwner });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (owner confirms/cancels, tenant cancels)
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isOwner = booking.owner.toString() === req.user.id;
    const isTenant = booking.user.toString() === req.user.id;

    if (!isOwner && !isTenant && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    const { bookingStatus, paymentStatus } = req.body;

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus && (isOwner || req.user.role === 'Admin')) booking.paymentStatus = paymentStatus;

    await booking.save();

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel/delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isOwner = booking.owner.toString() === req.user.id;
    const isTenant = booking.user.toString() === req.user.id;

    if (!isOwner && !isTenant && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    await booking.deleteOne();

    res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

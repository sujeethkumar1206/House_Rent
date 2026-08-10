const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalProperties, pendingProperties, approvedProperties, rejectedProperties, totalBookings, paidBookings] =
      await Promise.all([
        User.countDocuments({ role: 'User' }),
        Property.countDocuments(),
        Property.countDocuments({ status: 'Pending' }),
        Property.countDocuments({ status: 'Approved' }),
        Property.countDocuments({ status: 'Rejected' }),
        Booking.countDocuments(),
        Booking.find({ paymentStatus: 'Paid' }).populate('property', 'price')
      ]);

    // Calculate total revenue from paid bookings
    const totalRevenue = paidBookings.reduce((acc, b) => acc + (b.property?.price || 0), 0);

    // Monthly analytics: properties added per month for the current year
    const currentYear = new Date().getFullYear();
    const monthlyProperties = await Property.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31T23:59:59`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31T23:59:59`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProperties,
        pendingProperties,
        approvedProperties,
        rejectedProperties,
        totalBookings,
        totalRevenue
      },
      monthlyProperties,
      monthlyBookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with optional search
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { role: 'User' };
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ fullname: regex }, { email: regex }, { phone: regex }];
    }
    const users = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Block/unblock a user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties (any status) with optional search
// @route   GET /api/admin/properties
// @access  Private/Admin
exports.getAllProperties = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ title: regex }, { city: regex }, { location: regex }, { propertyType: regex }];
    }
    const properties = await Property.find(query)
      .populate('owner', 'fullname email phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: properties.length, properties });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a property
// @route   PUT /api/admin/properties/:id/approve
// @access  Private/Admin
exports.approveProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.status(200).json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a property
// @route   PUT /api/admin/properties/:id/reject
// @access  Private/Admin
exports.rejectProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.status(200).json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any property
// @route   DELETE /api/admin/properties/:id
// @access  Private/Admin
exports.deleteAnyProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const Booking = require('../models/Booking');
    const bookings = await Booking.find()
      .populate('property', 'title city')
      .populate('user', 'fullname email')
      .populate('owner', 'fullname email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getUsers,
  updateUser,
  deleteUser,
  getAllProperties,
  approveProperty,
  rejectProperty,
  deleteAnyProperty,
  getAllBookings
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes below require admin auth
router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);

router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/properties', getAllProperties);
router.put('/properties/:id/approve', approveProperty);
router.put('/properties/:id/reject', rejectProperty);
router.delete('/properties/:id', deleteAnyProperty);

router.get('/bookings', getAllBookings);

module.exports = router;

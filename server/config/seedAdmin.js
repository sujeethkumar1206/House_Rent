// Run with: node config/seedAdmin.js
// Creates a default admin account if one doesn't already exist.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL || 'admin@houserent.com';
  const existing = await User.findOne({ email });

  if (existing) {
    console.log('Admin user already exists:', email);
  } else {
    await User.create({
      fullname: 'Site Administrator',
      email,
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'Admin'
    });
    console.log('Admin user created:', email);
    console.log('Password:', process.env.ADMIN_PASSWORD || 'Admin@12345');
    console.log('Please log in and change this password immediately.');
  }

  await mongoose.disconnect();
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});

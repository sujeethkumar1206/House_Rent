const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false, // <-- இதுதான் timeout ஆகாமல் தடுக்கும்
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed initial properties if collection is empty
    try {
      const Property = require('../models/Property');
      const count = await Property.countDocuments();
      if (count === 0) {
        console.log('No properties found. Initializing seed data...');
        const seedAuto = require('./seedAuto');
        await seedAuto();
      }
    } catch (seedErr) {
      console.log('Seed check skipped:', seedErr.message);
    }
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
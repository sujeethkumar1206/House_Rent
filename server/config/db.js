const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/house_rent_db");
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed admin user & initial data if needed
    try {
      const seedAuto = require('./seedAuto');
      await seedAuto();
    } catch (seedErr) {
      console.log('Seed check skipped:', seedErr.message);
    }
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
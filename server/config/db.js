const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/house_rent_db");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed initial properties if collection is empty
    const Property = require('../models/Property');
    const count = await Property.countDocuments();
    if (count === 0) {
      console.log('No properties found. Initializing seed data...');
      const seedAuto = require('./seedAuto');
      await seedAuto();
    }
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Please ensure MONGO_URI environment variable is properly configured in your Render dashboard.');
  }
};

module.exports = connectDB;

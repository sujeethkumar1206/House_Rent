const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://sujeethkumarj007_db_user:sujeeth45@sujeeth.fbdm3sj.mongodb.net/house_rent?retryWrites=true&w=majority";
    const conn = await mongoose.connect(mongoUri);
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
  }
};

module.exports = connectDB;
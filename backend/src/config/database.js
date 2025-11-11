const mongoose = require('mongoose');

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/kitchen19';
  const maxAttempts = 5;
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      await mongoose.connect(uri);
      console.log('MongoDB connected');
      return;
    } catch (err) {
      attempt += 1;
      console.error(`MongoDB connection failed (attempt ${attempt}):`, err.message || err);
      if (attempt >= maxAttempts) throw err;
      await sleep(2000 * attempt);
    }
  }
};

module.exports = connectDB;

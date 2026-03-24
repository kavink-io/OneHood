/**
 * Run once: node seed-admin.js
 * Creates the admin account (email: Admin, password: 123)
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const User = require('./models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const existing = await User.findOne({ email: 'Admin' });
  if (existing) {
    if (!existing.isAdmin) {
      existing.isAdmin = true;
      await existing.save();
      console.log('Existing Admin account upgraded to admin.');
    } else {
      console.log('Admin account already exists and is already an admin.');
    }
    await mongoose.disconnect();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash('123', salt);

  await User.create({
    name: 'Admin',
    email: 'Admin',
    password: hashed,
    blockNo: 'Admin',
    phone: '0000000000',
    isAdmin: true,
  });

  console.log('✅ Admin account created: email=Admin  password=123');
  await mongoose.disconnect();
})();

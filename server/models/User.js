const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add this line to link a user to a hood
  hood: { type: mongoose.Schema.Types.ObjectId, ref: 'Hood', default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const HoodSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  // Location can be added later, keeping it simple for now.
  // location: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Hood', HoodSchema);
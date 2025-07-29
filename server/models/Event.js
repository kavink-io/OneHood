const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hood: { type: mongoose.Schema.Types.ObjectId, ref: 'Hood', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
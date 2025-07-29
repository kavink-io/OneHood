const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hood: { type: mongoose.Schema.Types.ObjectId, ref: 'Hood', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Notice', NoticeSchema);
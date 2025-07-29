const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const PollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [OptionSchema],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hood: { type: mongoose.Schema.Types.ObjectId, ref: 'Hood', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Poll', PollSchema);
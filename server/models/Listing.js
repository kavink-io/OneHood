const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
        type: String,
        required: true,
        enum: ['For Sale', 'For Rent', 'Wanted'] // Predefined categories
    },
    status: {
        type: String,
        default: 'Available',
        enum: ['Available', 'Sold/Rented']
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hood: { type: mongoose.Schema.Types.ObjectId, ref: 'Hood', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);
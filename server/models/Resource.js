const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    originalName: { type: String, required: true }, // e.g., "contact_list.pdf"
    serverFilename: { type: String, required: true }, // e.g., "1678886400000-contact_list.pdf"
    path: { type: String, required: true }, // e.g., "uploads/1678886400000-contact_list.pdf"
    mimetype: { type: String, required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hood: { type: mongoose.Schema.Types.ObjectId, ref: 'Hood', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
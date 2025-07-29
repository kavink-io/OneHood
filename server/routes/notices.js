const router = require('express').Router();
const Notice = require('../models/notice');
const { protect } = require('../middleware/authMiddleware');

// We export a function that takes 'io' as an argument
module.exports = function(io) {
    // @route   POST /api/notices
    // @desc    Create a new notice
    // @access  Private (we'll add admin-only logic later)
    router.post('/', protect, async (req, res) => {
        try {
            const { title, content } = req.body;
            const { id: authorId, hood: hoodId } = req.user;

            if (!hoodId) {
                return res.status(400).json({ message: 'You must be in a hood to post a notice.' });
            }

            const newNotice = new Notice({ title, content, author: authorId, hood: hoodId });
            await newNotice.save();
            await newNotice.populate('author', 'name');

            // Emit a 'new-notice' event to all clients in the hood's room
            io.to(hoodId).emit('new-notice', newNotice);

            res.status(201).json(newNotice);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error });
        }
    });

    // @route   GET /api/notices
    // @desc    Get all notices for the user's hood
    // @access  Private
    router.get('/', protect, async (req, res) => {
        try {
            const { hood: hoodId } = req.user;
            const notices = await Notice.find({ hood: hoodId }).populate('author', 'name').sort({ createdAt: -1 });
            res.json(notices);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error });
        }
    });

    return router;
};
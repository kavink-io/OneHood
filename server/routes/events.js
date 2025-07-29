const router = require('express').Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, date } = req.body;
        const { id: authorId, hood: hoodId } = req.user;

        if (!hoodId) {
            return res.status(400).json({ message: 'You must be in a hood to create an event.' });
        }

        const newEvent = new Event({ title, description, date, author: authorId, hood: hoodId });
        await newEvent.save();
        await newEvent.populate('author', 'name');
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// @route   GET /api/events
// @desc    Get all events for the user's hood
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { hood: hoodId } = req.user;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to the beginning of the day

        // Find events from today onwards
        const events = await Event.find({ hood: hoodId, date: { $gte: today } })
            .populate('author', 'name')
            .sort({ date: 1 }); // Show soonest events first

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

module.exports = router;
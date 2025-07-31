const router = require('express').Router();
const Listing = require('../models/Listing');
const { protect } = require('../middleware/adminMiddleware');
// @route   POST /api/listings
// @desc    Create a new marketplace listing
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, price, category } = req.body;
        const { id: authorId, hood: hoodId } = req.user;

        if (!hoodId) {
            return res.status(400).json({ message: 'You must be in a hood to create a listing.' });
        }

        const newListing = new Listing({ title, description, price, category, author: authorId, hood: hoodId });
        await newListing.save();
        await newListing.populate('author', 'name');
        res.status(201).json(newListing);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// @route   GET /api/listings
// @desc    Get all available listings for the user's hood
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { hood: hoodId } = req.user;
        const listings = await Listing.find({ hood: hoodId, status: 'Available' })
            .populate('author', 'name')
            .sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

module.exports = router;
const router = require('express').Router();
const User = require('../models/User');
// We need to create this adminMiddleware file next if it doesn't exist
const { protect, admin } = require('../middleware/adminMiddleware');

// @route   GET /api/admin/unverified-users
// @desc    Get all unverified users
// @access  Admin only
router.get('/unverified-users', [protect, admin], async (req, res) => {
    try {
        const users = await User.find({ isVerified: false });
        res.json(users);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
});

// @route   PUT /api/admin/verify-user/:id
// @desc    Verify a user
// @access  Admin only
router.put('/verify-user/:id', [protect, admin], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isVerified = true;
        await user.save();
        res.json({ message: 'User has been verified.' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
});

module.exports = router;
const router = require('express').Router();
const User = require('../models/User');
const { protect } = require('../middleware/adminMiddleware');
// @route   PUT /api/users/join
// @desc    User joins a hood
// @access  Private (requires token)
router.put('/join-hood', protect, async (req, res) => {
  try {
    const { hoodId } = req.body;

    // req.user.id is available because of the 'protect' middleware
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { hood: hoodId },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `Successfully joined hood.`, hood: user.hood });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
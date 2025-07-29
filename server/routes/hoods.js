const router = require('express').Router();
const Hood = require('../models/Hood');

// @route   POST /api/hoods
// @desc    Create a new Hood
router.post('/', async (req, res) => {
  const { name, userId } = req.body;
  try {
    const newHood = new Hood({
      name,
      createdBy: userId,
    });
    const savedHood = await newHood.save();
    res.status(201).json(savedHood);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// @route   GET /api/hoods
// @desc    Get all Hoods
router.get('/', async (req, res) => {
  try {
    const hoods = await Hood.find().sort({ createdAt: -1 });
    res.json(hoods);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
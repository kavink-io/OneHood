const router = require('express').Router();
const Poll = require('../models/Poll');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/polls
// @desc    Create a new poll
router.post('/', protect, async (req, res) => {
    const { question, options } = req.body;
    const { id: authorId, hood: hoodId } = req.user;
    try {
        const newPoll = new Poll({
            question,
            options: options.map(optionText => ({ text: optionText, votes: [] })),
            author: authorId,
            hood: hoodId
        });
        await newPoll.save();
        await newPoll.populate('author', 'name');
        res.status(201).json(newPoll);
    } catch (error) { res.status(500).json({ message: 'Server Error', error }); }
});

// @route   GET /api/polls
// @desc    Get all polls for the user's hood
router.get('/', protect, async (req, res) => {
    try {
        const polls = await Poll.find({ hood: req.user.hood }).populate('author', 'name').sort({ createdAt: -1 });
        res.json(polls);
    } catch (error) { res.status(500).json({ message: 'Server Error', error }); }
});

// @route   PUT /api/polls/:pollId/vote
// @desc    Vote on a poll option
router.put('/:pollId/vote', protect, async (req, res) => {
    const { optionId } = req.body;
    const userId = req.user.id;
    try {
        const poll = await Poll.findById(req.params.pollId);
        if (!poll) return res.status(404).json({ message: 'Poll not found.' });

        // Remove user's previous vote from all options in this poll
        poll.options.forEach(option => {
            option.votes.pull(userId);
        });

        // Add user's new vote to the selected option
        const selectedOption = poll.options.id(optionId);
        if (!selectedOption) return res.status(404).json({ message: 'Option not found.' });
        selectedOption.votes.push(userId);

        await poll.save();
        await poll.populate('author', 'name');
        res.json(poll);
    } catch (error) { res.status(500).json({ message: 'Server Error', error }); }
});

module.exports = router;
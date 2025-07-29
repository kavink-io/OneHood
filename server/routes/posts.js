const router = require('express').Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/posts
// @desc    Create a new post in the user's hood
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const { id: authorId, hood: hoodId } = req.user;

    if (!hoodId) {
      return res.status(400).json({ message: 'You must join a hood to post.' });
    }

    const newPost = new Post({
      content,
      author: authorId,
      hood: hoodId
    });

    const savedPost = await newPost.save();
    // Populate the author's name before sending the response
    await savedPost.populate('author', 'name'); 
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// @route   GET /api/posts/feed
// @desc    Get all posts for the logged-in user's hood
// @access  Private
router.get('/feed', protect, async (req, res) => {
  try {
    const { hood: hoodId } = req.user;
    if (!hoodId) {
      return res.json([]); // Return empty array if user has no hood
    }

    const posts = await Post.find({ hood: hoodId })
      .populate('author', 'name') // Populates the post's author
      .populate({ // Populates the comments and each comment's author
          path: 'comments',
          populate: {
              path: 'author',
              select: 'name'
          }
      })
      .sort({ createdAt: -1 }); // Show newest posts first

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            content: req.body.content,
            author: req.user.id
        };

        post.comments.push(newComment);
        await post.save();
        
        // Find the newly added comment to populate its author
        const createdComment = post.comments[post.comments.length - 1];
        await createdComment.populate('author', 'name');
        
        res.status(201).json(createdComment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// @route   PUT /api/posts/:id/like
// @desc    Like or unlike a post
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has already liked the post
        const userId = req.user.id;
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // If already liked, remove the like (unlike)
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            // If not liked, add the like
            post.likes.push(userId);
        }

        await post.save();
        res.json(post.likes); // Send back the updated array of likes

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Resource = require('../models/Resource');
const { protect } = require('../middleware/adminMiddleware');
// Configure multer storage
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// @route   POST /api/resources/upload
// @desc    Upload a new resource file
router.post('/upload', protect, upload.single('resourceFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file.' });
        }
        const { id: uploaderId, hood: hoodId } = req.user;
        const { originalname, filename, path: filePath, mimetype } = req.file;

        const newResource = new Resource({
            originalName: originalname,
            serverFilename: filename,
            path: filePath,
            mimetype,
            uploader: uploaderId,
            hood: hoodId
        });
        await newResource.save();
        await newResource.populate('uploader', 'name');
        res.status(201).json(newResource);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// @route   GET /api/resources
// @desc    Get all resources for the user's hood
router.get('/', protect, async (req, res) => {
    try {
        const resources = await Resource.find({ hood: req.user.hood })
            .populate('uploader', 'name')
            .sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// Add this new route to handle downloads
// @route   GET /api/resources/download/:id
// @desc    Download a resource file
router.get('/download/:id', async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'File not found.' });
        }

        // The res.download() method handles setting the headers to trigger a download
        // It takes two arguments: the path to the file on the server, and the desired filename for the user.
        res.download(resource.path, resource.originalName);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

module.exports = router;
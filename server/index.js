// 1. Import Core Dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// 2. Import Route Files
const authRoutes = require('./routes/auth');
const hoodRoutes = require('./routes/hoods');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const noticeRoutes = require('./routes/notices');
const eventRoutes = require('./routes/events');
const listingRoutes = require('./routes/listings');
const pollRoutes = require('./routes/polls');
const resourceRoutes = require('./routes/resources');
const adminRoutes = require('./routes/admin');

// 3. Initialize App, HTTP Server, and Socket.IO
const app = express();
const server = http.createServer(app);

// The URL of your live frontend on Vercel
const frontendURL = "https://one-hood.vercel.app"; // <-- Replace if your URL is different

const io = new Server(server, {
  cors: {
    origin: frontendURL,
    methods: ["GET", "POST", "PUT"]
  }
});

// 4. Configure Middleware
app.use(cors({ origin: frontendURL }));
app.use(express.json());

// 5. Serve Static Files (for uploads)
app.use('/uploads', express.static('uploads'));

// 6. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// 7. Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hoods', hoodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notices', noticeRoutes(io)); // Pass 'io' to notice routes
app.use('/api/events', eventRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('OneHood API is running! 🚀');
});

// 8. Set up Socket.IO Connection Logic
io.on('connection', (socket) => {
    socket.on('join-hood', (hoodId) => {
        socket.join(hoodId);
    });
});

// 9. Export the app for Vercel Serverless Functions
// This replaces app.listen() for compatibility with Vercel's environment
module.exports = app;
// 1. Import Core Dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Import the standard 'http' module
const { Server } = require('socket.io'); // Import the Server class from socket.io

// 2. Import Route Files
const authRoutes = require('./routes/auth');
const hoodRoutes = require('./routes/hoods');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const noticeRoutes = require('./routes/notices'); // This route is now a function
const eventRoutes = require('./routes/events');
const listingRoutes = require('./routes/listings');
const pollRoutes = require('./routes/polls');
const resourceRoutes = require('./routes/resources');




// 3. Initialize App, HTTP Server, and Socket.IO
const app = express();
const server = http.createServer(app); // Create an HTTP server using the Express app
const io = new Server(server, {         // Attach Socket.IO to the HTTP server
  cors: {
    origin: "http://localhost:5173", // Explicitly allow your React frontend origin
    methods: ["GET", "POST", "PUT"]
  }
});

// 4. Configure Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 5. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// 6. Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hoods', hoodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
// Pass the 'io' instance to the notice routes so they can emit events
app.use('/api/notices', noticeRoutes(io));
app.use('/api/events', eventRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/resources', resourceRoutes);


// A simple test route to make sure the server is running.
app.get('/', (req, res) => {
    res.send('OneHood API is running! 🚀');
});

// 7. Set up Socket.IO Connection Logic
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Listen for a client to join a hood-specific room
    socket.on('join-hood', (hoodId) => {
        socket.join(hoodId);
        console.log(`Socket ${socket.id} joined hood room: ${hoodId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// 8. Start the Server
const PORT = process.env.PORT || 5000;
// Use 'server.listen' instead of 'app.listen' to start both Express and Socket.IO
server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
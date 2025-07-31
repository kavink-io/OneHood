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

// 3. Initialize App, HTTP Server
const app = express();
const server = http.createServer(app);

// 4. Configure CORS for multiple origins
const allowedOrigins = [
    "https://one-hood.vercel.app", // Your live Vercel URL
    "http://localhost:5173"      // Your local development URL
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
};

app.use(cors(corsOptions));

// 5. Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT"]
  }
});

// 6. Configure Middleware
app.use(express.json());

// 7. Serve Static Files (for uploads)
app.use('/uploads', express.static('uploads'));

// 8. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// 9. Define API Routes
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

// 10. Set up Socket.IO Connection Logic
io.on('connection', (socket) => {
    socket.on('join-hood', (hoodId) => {
        socket.join(hoodId);
    });
});

// 11. Start the Server for Local Development
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));


/*
// FOR VERCEL DEPLOYMENT: Comment out the server.listen() block above
// and uncomment the line below.
module.exports = app;
*/
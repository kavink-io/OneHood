// 1. Import Core Dependencies
require('dotenv').config(); // Loads environment variables from a .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const hoodRoutes = require('./routes/hoods');

// 2. Import Route Files
const authRoutes = require('./routes/auth');

// 3. Initialize Express App
const app = express();

// 4. Configure Middleware
// This allows your frontend (running on a different port) to make API requests to this server.
app.use(cors());
// This allows the server to understand and process incoming request bodies in JSON format.
app.use(express.json());

// 5. Connect to the MongoDB Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// 6. Define API Routes
// All routes defined in auth.js will be prefixed with /api/auth
// For example, the '/register' route becomes '/api/auth/register'
app.use('/api/auth', authRoutes);
app.use('/api/hoods', hoodRoutes);

// A simple test route to make sure the server is running.
app.get('/', (req, res) => {
  res.send('OneHood API is running! 🚀');
});

// 7. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
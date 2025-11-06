const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const net = require('net');
const socketIo = require('socket.io');
const sequelize = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Load environment variables
dotenv.config({ path: '../.env' }); // Load from root .env
dotenv.config(); // Also load from backend/.env if it exists

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection with Sequelize
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to PostgreSQL database');
    return sequelize.sync({ alter: true }); // This will update tables based on models
  })
  .then(() => {
    console.log('✅ Database tables synchronized');
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
  });

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-user', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Task Management API is running!' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Add some debug logging
console.log(`Starting server on port ${PORT}...`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

server.listen(PORT, (err) => {
  if (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌐 Access the API at: http://localhost:${PORT}`);
  console.log(`🌐 Access the API at: http://127.0.0.1:${PORT}`);
  
  // Test if the server is actually listening
  setTimeout(() => {
    const testSocket = new net.Socket();
    testSocket.connect(PORT, 'localhost', () => {
      console.log('✅ Server is accessible on localhost');
      testSocket.destroy();
    });
    testSocket.on('error', (err) => {
      console.log('❌ Server connection test failed:', err.message);
    });
  }, 1000);
});
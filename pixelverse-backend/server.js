import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { createServer } from 'http';
import config from './config/config.js';
import { globalErrorHandler } from './utils/errorHandler.js';

const app = express();
const httpServer = createServer(app);

// Middleware pipeline
app.use(express.json({ limit: '10kb' }));
app.use(helmet()); // Security headers
app.use(cors({ origin: config.CLIENT_URL }));

// Rate limiting (100 requests/15min per IP)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP',
  })
);

// Connect to MongoDB
await mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Connection pool size
});

// Socket.IO setup
const io = new Server(httpServer, {
  cors: { origin: config.CLIENT_URL },
  connectionStateRecovery: {}, // Auto-reconnect for real-time features
});

// API Routes
import authRouter from './routes/authRoutes.js';
app.use('/api/v1/auth', authRouter);

// Error handling
app.use(globalErrorHandler);

// Start server
httpServer.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});


io.on('connection', (socket) => {
  // Join tavern on login
  socket.on('joinTavern', async (userId) => {
    const user = await User.findById(userId);
    socket.join('tavern');
    
    // Broadcast to tavern
    io.to('tavern').emit('userEntered', user);
  });

  // Private meeting creation
  socket.on('createMeeting', async (userId) => {
    const meetingId = crypto.randomBytes(8).toString('hex');
    await User.findByIdAndUpdate(userId, { 
      currentRoom: 'meeting', 
      meetingId 
    });
    
    socket.leave('tavern');
    socket.join(meetingId);
    socket.emit('meetingCreated', meetingId);
  });

  // Avatar movement (tavern only)
  socket.on('move', async ({ userId, x, y }) => {
    await User.findByIdAndUpdate(userId, { position: { x, y } });
    socket.to('tavern').emit('playerMoved', { userId, x, y });
  });
});
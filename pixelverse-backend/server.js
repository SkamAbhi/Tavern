// server.js
import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

// Import middleware
import { apiLimiter } from "./middleware/rateLimit.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import { router as meetingRoutes } from "./routes/meetingRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import tavernRoutes from "./routes/tavernRoutes.js";

// Import socket setup
import setupSocketIO from "./socket/socket.js";

// Import Swagger setup
// import setupSwagger from './swagger/swagger.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Setup socket.io
const io = setupSocketIO(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Logging

// Apply rate limiting to all routes
// app.use('/api', apiLimiter);

// Share io instance across routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.send("Server is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/tavern", tavernRoutes);

// API Documentation
// setupSwagger(app);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/tavern")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Registered Route: ${r.route.path}`);
  }
});
// Store connected players
const players = new Map();
io.on('connection', (socket) => {
  console.log('New connection - Socket ID:', socket.id);

  socket.on('playerLogin', (userData) => {
    const { userId, username, x, y } = userData;
    players.set(socket.id, { 
      id: userId, 
      username, 
      x: x !== undefined ? x : 1000, 
      y: y !== undefined ? y : 1200 
    });

    console.log('Player login received:', { userId, username, x, y }, 'Socket ID:', socket.id);

    // Send all existing players to the new client
    socket.emit('loadPlayers', Array.from(players.entries()).map(([socketId, data]) => ({
      socketId,
      id: data.id,
      username: data.username,
      x: data.x,
      y: data.y
    })));

    // Broadcast new player to all other clients
    socket.broadcast.emit('playerJoined', {
      socketId: socket.id,
      id: userId,
      username,
      x: players.get(socket.id).x,
      y: players.get(socket.id).y
    });

    console.log('Players:', Array.from(players.keys()));
  });

  socket.on('playerMove', (position) => {
    const player = players.get(socket.id);
    if (player) {
      player.x = position.x;
      player.y = position.y;
      socket.broadcast.emit('playerMoved', { socketId: socket.id, position });
      console.log(`Player ${socket.id} moved to:`, position);
    }
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    players.delete(socket.id);
    io.emit('playerLeft', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `API documentation available at http://localhost:${PORT}/api-docs`
  );
});

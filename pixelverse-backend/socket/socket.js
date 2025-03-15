// socket/socket.js
import { Server } from 'socket.io';
import { verifyToken } from '../services/jwt.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

export default function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      
      const decoded = await verifyToken(token);
      const user = await User.findById(decoded.id);
      
      if (!user) return next(new Error('User not found'));
      
      socket.user = {
        id: user._id,
        username: user.username,
        currentRoom: user.currentRoom,
        meetingId: user.meetingId
      };
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);
    
    // Join the appropriate room
    const roomId = socket.user.currentRoom === 'meeting' 
      ? socket.user.meetingId 
      : 'tavern';
      
    socket.join(roomId);
    
    // Broadcast to room that user has connected
    socket.to(roomId).emit('user_joined', {
      userId: socket.user.id,
      username: socket.user.username
    });
    
    // Handle position updates in tavern
    socket.on('update_position', async (position) => {
      try {
        // Update user position in DB
        await User.findByIdAndUpdate(socket.user.id, {
          'position.x': position.x,
          'position.y': position.y
        });
        
        // Broadcast position to others in tavern
        if (socket.user.currentRoom === 'tavern') {
          socket.to('tavern').emit('user_moved', {
            userId: socket.user.id,
            position
          });
        }
      } catch (error) {
        console.error('Position update error:', error);
      }
    });
    
    // Handle chat messages
    socket.on('send_message', async (messageData) => {
      try {
        const { content } = messageData;
        const roomId = socket.user.currentRoom === 'meeting' 
          ? socket.user.meetingId 
          : 'tavern';
        
        // Save message to database
        const message = await Message.create({
          sender: socket.user.id,
          content,
          room: roomId
        });
        
        // Broadcast message to room
        io.to(roomId).emit('new_message', {
          id: message._id,
          content: message.content,
          sender: {
            id: socket.user.id,
            username: socket.user.username
          },
          createdAt: message.createdAt
        });
      } catch (error) {
        console.error('Message error:', error);
      }
    });
    
    // Handle room changes
    socket.on('change_room', async (data) => {
      try {
        const { newRoom, meetingId } = data;
        const oldRoom = socket.user.currentRoom === 'meeting' 
          ? socket.user.meetingId 
          : 'tavern';
        
        // Update user in database
        await User.findByIdAndUpdate(socket.user.id, {
          currentRoom: newRoom,
          meetingId: newRoom === 'meeting' ? meetingId : null
        });
        
        // Leave old room and join new one
        socket.leave(oldRoom);
        const newRoomId = newRoom === 'meeting' ? meetingId : 'tavern';
        socket.join(newRoomId);
        
        // Update socket user data
        socket.user.currentRoom = newRoom;
        socket.user.meetingId = newRoom === 'meeting' ? meetingId : null;
        
        // Inform rooms of the change
        socket.to(oldRoom).emit('user_left', {
          userId: socket.user.id,
          username: socket.user.username
        });
        
        socket.to(newRoomId).emit('user_joined', {
          userId: socket.user.id,
          username: socket.user.username
        });
      } catch (error) {
        console.error('Room change error:', error);
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      const roomId = socket.user.currentRoom === 'meeting' 
        ? socket.user.meetingId 
        : 'tavern';
      
      socket.to(roomId).emit('user_left', {
        userId: socket.user.id,
        username: socket.user.username
      });
      
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });

  return io;
}
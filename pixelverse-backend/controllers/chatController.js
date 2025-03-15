// controllers/chatController.js
import Message from '../models/Message.js';
import User from '../models/User.js';

/**
 * Send a new message
 * @route POST /api/chat/messages
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Message content cannot be empty' });
    }
    
    // Get user's current room
    const user = await User.findById(req.user.id);
    
    // Determine which room to send to (tavern or specific meeting)
    const room = user.currentRoom === 'meeting' ? user.meetingId : 'tavern';
    
    // Create and save the message
    const message = await Message.create({
      sender: req.user.id,
      content: content.trim(),
      room
    });
    
    // Populate sender details before returning
    await message.populate('sender', 'username');
    
    // If socket.io is attached to the request, emit to room
    if (req.io) {
      req.io.to(room).emit('new_message', {
        id: message._id,
        content: message.content,
        sender: {
          id: message.sender._id,
          username: message.sender.username
        },
        createdAt: message.createdAt
      });
    }
    
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

/**
 * Get messages for user's current room
 * @route GET /api/chat/messages
 */
export const getMessages = async (req, res, next) => {
  try {
    // Get pagination parameters
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 0;
    
    // Get user's current room
    const user = await User.findById(req.user.id);
    
    // Determine which room's messages to get
    const room = user.currentRoom === 'meeting' ? user.meetingId : 'tavern';
    
    // Find messages for this room
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate('sender', 'username')
      .lean();
    
    // Count total messages in room for pagination
    const totalMessages = await Message.countDocuments({ room });
    
    res.json({
      messages: messages.reverse(), // Return chronological order
      pagination: {
        total: totalMessages,
        page,
        limit,
        pages: Math.ceil(totalMessages / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a message
 * @route DELETE /api/chat/messages/:id
 */
export const deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    
    // Find the message
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Check if user is the sender
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }
    
    // Delete the message
    await Message.findByIdAndDelete(messageId);
    
    // Notify room about deletion if socket.io is attached
    if (req.io) {
      req.io.to(message.room).emit('message_deleted', { id: messageId });
    }
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Get chat history for a specific meeting
 * @route GET /api/chat/history/:meetingId
 */
export const getMeetingHistory = async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    
    // Ensure user has access to this meeting
    // You might want to add more checks here depending on your requirements
    
    // Get messages for this meeting
    const messages = await Message.find({ room: meetingId })
      .sort({ createdAt: 1 })
      .populate('sender', 'username')
      .lean();
    
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
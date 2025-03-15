// routes/chatRoutes.js
import express from 'express';
import { 
  sendMessage, 
  getMessages, 
  deleteMessage, 
  getMeetingHistory 
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Send a new message
router.post('/messages', protect, sendMessage);

// Get messages for current room
router.get('/messages', protect, getMessages);

// Delete a message
router.delete('/messages/:id', protect, deleteMessage);

// Get chat history for a specific meeting
router.get('/history/:meetingId', protect, getMeetingHistory);

export default router;
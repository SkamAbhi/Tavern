import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import { Meeting } from '../models/Meeting.js';

// Create meeting
router.post('/create', protect, async (req, res) => {
  const meetingId = require('crypto').randomBytes(4).toString('hex'); // e.g., "a3f8"
  
  const meeting = await Meeting.create({
    meetingId,
    creator: req.user.id,
    expiresAt: new Date(Date.now() + 3600 * 1000) // 1h expiry
  });

  res.status(201).json({ meetingId });
});

// Join meeting
router.post('/:meetingId/join', protect, async (req, res) => {
  const meeting = await Meeting.findOne({ meetingId: req.params.meetingId });
  
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
  
  // Update user's room
  req.user.currentRoom = 'meeting';
  req.user.meetingId = meeting.meetingId;
  await req.user.save();

  res.json({ success: true });
});

export { router };  // ✅ Named export

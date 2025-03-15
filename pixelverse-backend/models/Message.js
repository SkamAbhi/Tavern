// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  room: { 
    type: String, 
    required: true, 
    index: true 
  }, // 'tavern' or specific meetingId
}, { 
  timestamps: true 
});

// Create indexes for efficient queries
messageSchema.index({ room: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
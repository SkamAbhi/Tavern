import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  meetingId: { type: String, unique: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiresAt: { type: Date, index: { expires: 0 } } // Auto-delete after TTL
}, { timestamps: true });

export const Meeting = mongoose.model('Meeting', meetingSchema);

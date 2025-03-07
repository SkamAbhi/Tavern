import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// models/User.js
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    currentRoom: { 
      type: String, 
      enum: ['tavern', 'meeting'], 
      default: 'tavern' 
    },
    position: { // For tavern avatars
      x: Number,
      y: Number
    },
    meetingId: String // Null if in tavern
  });
  
// Password hashing (pre-save hook)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Indexes for frequent queries
userSchema.index({ position: '2dsphere' }); // For geospatial queries
userSchema.index({ username: 'text' }); // For search

export default mongoose.model('User', userSchema);
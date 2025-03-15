// controllers/authController.js
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { signToken } from '../services/jwt.js';

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or username already exists' 
      });
    }
    
    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      currentRoom: 'tavern',
      position: {
        x: Math.floor(Math.random() * 100), // Random starting position
        y: Math.floor(Math.random() * 100)
      }
    });
    
    // Generate JWT token
    const token = signToken(user._id);
    
    // Return user data and token
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        currentRoom: user.currentRoom,
        position: user.position
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = signToken(user._id);
    
    // Return user data and token
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        currentRoom: user.currentRoom,
        position: user.position
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // In a stateless JWT system, actual logout happens on the client
    // by removing the token. This endpoint is mostly for consistency.
    
    // If you want to implement token blacklisting, you would add that here
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        currentRoom: user.currentRoom,
        position: user.position
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    
    // Ensure username/email aren't already taken
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.user.id } },
          { $or: [
            ...(username ? [{ username }] : []),
            ...(email ? [{ email }] : [])
          ]}
        ]
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Username or email already taken' });
      }
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { username, email } },
      { new: true }
    );
    
    res.json({
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        currentRoom: updatedUser.currentRoom,
        position: updatedUser.position
      }
    });
  } catch (error) {
    next(error);
  }
};
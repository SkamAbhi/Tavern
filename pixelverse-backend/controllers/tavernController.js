// controllers/tavernController.js
import User from '../models/User.js';

export const updatePosition = async (req, res) => {
  try {
    const { x, y } = req.body;
    
    // Ensure user is in tavern
    if (req.user.currentRoom !== 'tavern') {
      return res.status(400).json({ error: 'User not in tavern' });
    }
    
    // Update position
    await User.findByIdAndUpdate(req.user.id, {
      'position.x': x,
      'position.y': y
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getNearbyUsers = async (req, res) => {
  try {
    // Ensure user is in tavern
    if (req.user.currentRoom !== 'tavern') {
      return res.status(400).json({ error: 'User not in tavern' });
    }
    
    // Get current user position
    const currentUser = await User.findById(req.user.id);
    
    // Find users in tavern within certain range
    const nearbyUsers = await User.find({
      _id: { $ne: req.user.id },
      currentRoom: 'tavern',
      position: {
        $exists: true
      }
    }).select('username position');
    
    // Calculate distance and filter by proximity
    const usersWithDistance = nearbyUsers.map(user => {
      const dx = user.position.x - currentUser.position.x;
      const dy = user.position.y - currentUser.position.y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      return {
        id: user._id,
        username: user.username,
        position: user.position,
        distance
      };
    });
    
    // Sort by distance and limit to closest 10
    const closestUsers = usersWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);
    
    res.json(closestUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
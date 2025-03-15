import { verifyToken } from '../services/jwt.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Missing token');

    const decoded = await verifyToken(token);
    const user = await User.findById(decoded.id).select('+password');
    if (!user) throw new Error('User no longer exists');

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
}; 
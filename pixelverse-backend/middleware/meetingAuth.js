export const checkMeetingAccess = async (req, res, next) => {
    const meeting = await Meeting.findOne({ 
      id: req.params.id,
      expiresAt: { $gt: new Date() }
    });
    
    if (!meeting) return res.status(404).json({ error: 'Meeting expired' });
    next();
  };
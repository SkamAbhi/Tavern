// controllers/meetingController.js
export const createMeeting = async (req, res) => {
    const meetingId = crypto.randomBytes(8).toString('hex');
    
    // Store meeting in DB with expiration
    await Meeting.create({
      id: meetingId,
      creator: req.user.id,
      expiresAt: new Date(Date.now() + 3600 * 1000) // 1h expiry
    });
  
    res.json({ meetingId });
  };
  
  export const joinMeeting = async (req, res) => {
    const meeting = await Meeting.findOne({ id: req.params.id });
    if (!meeting) throw new Error('Meeting not found');
    
    // Update user's room status
    await User.findByIdAndUpdate(req.user.id, {
      currentRoom: 'meeting',
      meetingId: req.params.id
    });
  
    res.json({ success: true });
  };
const ChatSession = require('../models/chatSession');
const ChatMessage = require('../models/chatMessage');
const { updateSessionTitleSchema } = require('../utils/schemas');

module.exports.index = (req, res) => {
    res.render('chat/index');
};

module.exports.createSession = async (req, res) => {
    const session = new ChatSession({
        userId: req.user._id,
        title: "New Chat"
    });
    await session.save();
    res.status(201).json(session);
};

module.exports.getSessions = async (req, res) => {
    const sessions = await ChatSession.find({ userId: req.user._id })
        .sort({ updatedAt: -1 });
    res.status(200).json(sessions);
};

module.exports.getSessionById = async (req, res) => {
    const { sessionId } = req.params;
    const session = await ChatSession.findOne({ 
        _id: sessionId, 
        userId: req.user._id 
    }).populate('messages');
    
    if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
    }
    res.status(200).json(session);
};

module.exports.updateSessionTitle = async (req, res) => {
    const { error, value } = updateSessionTitleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
    }
    
    const { sessionId } = req.params;
    const { title } = value;
    
    const session = await ChatSession.findOneAndUpdate(
        { _id: sessionId, userId: req.user._id },
        { title },
        { new: true }
    );
    
    if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
    }
    res.status(200).json(session);
};

module.exports.deleteSession = async (req, res) => {
    const { sessionId } = req.params;
    
    // Delete all messages in the session
    await ChatMessage.deleteMany({ sessionId });
    
    // Delete the session
    const session = await ChatSession.findOneAndDelete({ 
        _id: sessionId, 
        userId: req.user._id 
    });
    
    if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
    }
    res.status(200).json({ message: "Chat session deleted successfully" });
};
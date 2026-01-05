const ChatMessage = require('../models/chatMessage');
const ChatSession = require('../models/chatSession');
const { createMessageSchema, updateMessageSchema } = require('../utils/schemas');
const ExpressError = require('../utils/ExpressError');

module.exports.createMessage = async (req, res) => {
    const { error, value } = createMessageSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
    }
    
    const { sessionId } = req.params;
    const { role, content } = value;
    
    // Verify session belongs to user
    const session = await ChatSession.findOne({ 
        _id: sessionId, 
        userId: req.user._id 
    });
    
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }
    
    const message = new ChatMessage({
        sessionId,
        role,
        content
    });
    
    await message.save();
    
    // Add message to session
    session.messages.push(message._id);
    session.updatedAt = Date.now();
    await session.save();
    
    res.status(201).json(message);
};

module.exports.updateMessage = async (req, res) => {
    const { error, value } = updateMessageSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
    }
    
    const { messageId } = req.params;
    const { content } = value;
    
    const message = await ChatMessage.findById(messageId).populate('sessionId');
    
    if (!message) {
        return res.status(404).json({ message: "Message not found" });
    }
    
    // Verify session belongs to user
    if (message.sessionId.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    
    message.content = content;
    message.edited = true;
    await message.save();
    
    res.status(200).json(message);
};

module.exports.deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    
    const message = await ChatMessage.findById(messageId).populate('sessionId');
    
    if (!message) {
        return res.status(404).json({ message: "Message not found" });
    }
    
    // Verify session belongs to user
    if (message.sessionId.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    
    // Remove from session
    await ChatSession.findByIdAndUpdate(message.sessionId._id, {
        $pull: { messages: messageId }
    });
    
    await ChatMessage.findByIdAndDelete(messageId);
    
    res.status(200).json({ message: "Message deleted successfully" });
};

module.exports.getSessionMessages = async (req, res) => {
    const { sessionId } = req.params;
    
    // Verify session belongs to user
    const session = await ChatSession.findOne({ 
        _id: sessionId, 
        userId: req.user._id 
    });
    
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }
    
    const messages = await ChatMessage.find({ sessionId })
        .sort({ createdAt: 1 });
    
    res.status(200).json(messages);
};
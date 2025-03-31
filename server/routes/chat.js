const express = require('express');
const PrivateChat = require('../models/Chat');

const router = express.Router();

// Helper function to calculate time difference
const getTimeDifference = (date) => {
    const now = new Date();
    const diffMs = now - date; // Difference in milliseconds
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHr > 0) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    return `${diffSec} second${diffSec > 1 ? 's' : ''} ago`;
};

module.exports = (io) => {
    // Create a new chat
    router.post('/create', async (req, res) => {
        try {
            const { participantIds, message } = req.body;
            console.log(req.body);

            if (!participantIds || participantIds.length !== 2) {
                return res.status(400).json({ message: 'Exactly 2 participants required' });
            }

            const existingChat = await PrivateChat.findOne({
                participants: { $all: participantIds, $size: 2 },
            });

            if (existingChat) {
                const chatWithTimeDiff = {
                    ...existingChat.toObject(),
                    messages: existingChat.messages.map(msg => ({
                        ...msg.toObject(),
                        timeAgo: getTimeDifference(msg.createdAt), // Add time difference
                    })),
                };
                participantIds.forEach(userId => {
                    io.to(userId.toString()).emit('newChat', chatWithTimeDiff);
                });
                return res.status(200).json(chatWithTimeDiff);
            }

            const newChat = new PrivateChat({
                participants: participantIds,
                messages: [{
                    senderId: participantIds[0],
                    content: message || 'Chat started',
                    isRead: false,
                }],
                lastMessage: message || 'Chat started',
            });

            await newChat.save();

            const chatWithTimeDiff = {
                ...newChat.toObject(),
                messages: newChat.messages.map(msg => ({
                    ...msg.toObject(),
                    timeAgo: getTimeDifference(msg.createdAt),
                })),
            };
            console.log(chatWithTimeDiff);


            participantIds.forEach(userId => {
                io.to(userId.toString()).emit('newChat', chatWithTimeDiff);
            });

            res.status(201).json(chatWithTimeDiff);
        } catch (error) {
            res.status(500).json({ message: 'Error creating chat', error });
        }
    });

    // Get all chats for a user
    router.get('/user/:userId', async (req, res) => {
        try {
            const { userId } = req.params;
            const chats = await PrivateChat.find({
                participants: userId,
            })
                .populate('participants', 'username')
                .sort({ updatedAt: -1 });

            const chatsWithTimeDiff = chats.map(chat => ({
                ...chat.toObject(),
                messages: chat.messages.map(msg => ({
                    ...msg.toObject(),
                    timeAgo: getTimeDifference(msg.createdAt),
                })),
            }));
            console.log(chatsWithTimeDiff);


            res.json(chatsWithTimeDiff);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching chats', error });
        }
    });

    // Get single chat by ID
    router.get('/:chatId', async (req, res) => {
        try {
            const { chatId } = req.params;
            const chat = await PrivateChat.findById(chatId)
                .populate('participants', 'username')
                .populate('messages.senderId', 'username');

            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }

            const chatWithTimeDiff = {
                ...chat.toObject(),
                messages: chat.messages.map(msg => ({
                    ...msg.toObject(),
                    timeAgo: getTimeDifference(msg.createdAt),
                })),
            };
            console.log(chatWithTimeDiff);


            res.json(chatWithTimeDiff);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching chat', error });
        }
    });

    // Update chat (add new message)
    router.put('/:chatId/message', async (req, res) => {
        try {
            const { chatId } = req.params;
            const { senderId, content } = req.body;
            console.log(req.body);

            const chat = await PrivateChat.findById(chatId);
            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }

            if (!chat.participants.includes(senderId)) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const newMessage = {
                senderId,
                content,
                isRead: false,
            };

            chat.messages.push(newMessage);
            chat.lastMessage = content;
            await chat.save();

            const chatWithTimeDiff = {
                ...chat.toObject(),
                messages: chat.messages.map(msg => ({
                    ...msg.toObject(),
                    timeAgo: getTimeDifference(msg.createdAt),
                })),
            };

            chat.participants.forEach(userId => {
                io.emit('newMessage', {
                    chatId,
                    message: {
                        ...newMessage,
                        timeAgo: getTimeDifference(new Date()), // Real-time for new message
                    },
                });
            });

            res.json(chatWithTimeDiff);
        } catch (error) {
            res.status(500).json({ message: 'Error adding message', error });
        }
    });

    // Delete chat
    router.delete('/:chatId', async (req, res) => {
        try {
            const { chatId } = req.params;
            const chat = await PrivateChat.findByIdAndDelete(chatId);

            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }

            chat.participants.forEach(userId => {
                io.to(userId.toString()).emit('chatDeleted', chatId);
            });

            res.json({ message: 'Chat deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting chat', error });
        }
    });

    return router;
};
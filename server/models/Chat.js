const mongoose = require("mongoose");

const privateChatSchema = new mongoose.Schema({
    // Participants in the chat (array of 2 user IDs)
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    // Message content
    messages: [{
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
        // Optional: for media attachments
        attachment: {
            type: String, // Could store URL or file path
            default: null
        }
    }],
    // Optional: last message preview
    lastMessage: {
        type: String,
        default: null
    }
}, { timestamps: true });

// Create index for better query performance
privateChatSchema.index({ participants: 1 });

const PrivateChat = mongoose.model("PrivateChat", privateChatSchema);

module.exports = PrivateChat;
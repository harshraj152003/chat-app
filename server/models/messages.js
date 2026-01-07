import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
    seen: {
        type: Boolean,
        default: false
    }
}, { timestamps:true })

messageSchema.index({ senderId: 1, recieverId: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
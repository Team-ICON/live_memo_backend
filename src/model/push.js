import mongoose from "mongoose";

const pushSchema = new mongoose.Schema({
    fromUser: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ],
    content : String,
    pushTime: { type: Date, default: Date.now() },
})

const model = mongoose.model('Push', pushSchema);

export default model;
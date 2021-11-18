import mongoose from "mongoose";

const pushSchema = new mongoose.Schema({
    _id: String,
    fromUser: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    body: String,
    pushTime: { type: Date, default: Date.now() },
})

const model = mongoose.model('Push', pushSchema);

export default model;
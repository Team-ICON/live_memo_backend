import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    users: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ],
})

const model = mongoose.model('Group', groupSchema);

export default model;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: String,
    userID: String,
    profileName: String,
    memoList: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Memo'}
    ],
    groups: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Group'}
    ]
    
})

const model = mongoose.model('User', userSchema);

export default model;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: String,
    profileName: String,
    memoList: Map,
    folderList: Map, 
    PushList: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Push'}
    ]
})

const model = mongoose.model('User', userSchema);

export default model;
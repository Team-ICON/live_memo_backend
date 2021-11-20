import mongoose from "mongoose";

const memoSchema = new mongoose.Schema({
    _id: String,
    title: String,
    content: String,
    createTime: { type: Date, default: Date.now() },
    updateTime: { type: Date, default: Date.now() },
    userList: [String],
})

const model = mongoose.model('Memo', memoSchema);

export default model;

/*
   bans: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Ban'}
    ]

    date: { type: Date , default: Date.now()},

*/
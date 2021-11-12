import mongoose from "mongoose";

const memoSchema = new mongoose.Schema({
    content : String,
    createTime: { type: Date , default: Date.now() },
    updateTime: { type: Date, default: Date.now() },
    userList: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ],
    userCnt: Number,
})

const model = mongoose.model('Memo', memoSchema);

export default model;

/*
   bans: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Ban'}
    ]

    date: { type: Date , default: Date.now()},

*/
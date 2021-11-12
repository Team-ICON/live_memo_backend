import mongoose from "mongoose";

const memoSchema = new mongoose.Schema({
    memoContent: String, //일단 Buffer --> 추후 실험 후 결정
    createTime: { type: Date , default: Date.now() },
    updateTime: { type: Date, default: Date.now() },
    userList: [
        // { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
        { type: String }
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
import mongoose from "mongoose";

const memoSchema = new mongoose.Schema({
    // yDoc: mongoose.Schema.Types.Decimal128, //binary는 buffer로 하나..?확인해보기
    yDoc : Buffer,
    createTime: { type: Date , default: Date.now() },
    updateTime: { type: Date, default: Date.now() },
    userList: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ],
    // userList : String,
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
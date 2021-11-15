import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
    title: String,
    memos: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Memo' }
    ],
})

const model = mongoose.model('Folder', folderSchema);

export default model;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    ID : String,
    email: { type: String, required: true},
    profileName: String,
    pushList: [{type: mongoose.Schema.Types.ObjectId, ref: "Push"}],
    folderList: Map, // {key: String, val: list[ ObjetID ]}
    memoList: Map, // {key: ObjectID, val: String}
    // bookmarkList: Map
})

const model = mongoose.model('User', userSchema);

export default model;
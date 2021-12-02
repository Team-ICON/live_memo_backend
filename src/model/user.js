import mongoose from "mongoose";
import { v4 } from 'uuid';

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: [true, 'email already registered']
    },
    profileName: {
        type: String,
        default: ''
    },
    picture: {
        type: String,
    },
    pushList: {
        type: Array,
        ref: "Push",
        default: []
    },
    folderList: {
        type: Map,
        default: {
            "DEFAULT": [],
            "BOOKMARK": []
        },
    },
    memoList: {
        type: Map,
        default: {},
    },
    fcmToken: {
        type: String,
    },
    color: {
        type: String,
    }
})

const model = mongoose.model('User', userSchema);

export default model;
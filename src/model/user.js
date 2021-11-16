import mongoose from "mongoose";
import { v4 } from 'uuid';

const userSchema = new mongoose.Schema({
    ID : {
        type: String,
        default: v4(),
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
    pushList: {
        type : Array,
        ref: "Push",
        default: []
    },
    folderList: {
        type: Map,
        default: {
            "DEFAULT" : [],
            "BOOKMARK": []
        },
    }, 
    memoList: {
        type: Map,
        default: {},
    } 
})

const model = mongoose.model('User', userSchema);

export default model;
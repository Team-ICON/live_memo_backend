import mongoose from "mongoose";
import { v4 } from 'uuid';

const userSchema = new mongoose.Schema({
<<<<<<< HEAD
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
=======
    ID : String,
    email: { type: String, required: true},
    profileName: String,
    pushList: [{type: mongoose.Schema.Types.ObjectId, ref: "Push"}],
    folderList: Map, // {key: String, val: list[ ObjetID ]}
    memoList: Map, // {key: ObjectID, val: String}
    // bookmarkList: Map
>>>>>>> jb
})

const model = mongoose.model('User', userSchema);

export default model;
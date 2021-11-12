import mongoose from "mongoose";


const pushSchema = new mongoose.Schema({
    fromUser: String,
    pushContent: String,
    pushTime: { type: Date, default: Date.now() }
})

const model = mongoose.model('Push', pushSchema)

export default model;
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.oaxnc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {   //options
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
// mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.01dsj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
//     {   //options
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     }
// )

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
    console.log('✅ DB connected.')
})
import express from "express";
import dotenv from "dotenv";
import Ydoc from "./src/model/memo";
import cors from "cors";
import passport from 'passport';

var bodyParser = require('body-parser');

/* Routers */
import memoRouter from "./src/Router/memoRouter";
import userRouter from "./src/Router/userRouter";
import folderRouter from "./src/Router/folderRouter";

dotenv.config();
import "./src/db";

const app = express();
const PORT = process.env.PORT || 33333;

/* 미들웨어 */
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// google authentication
app.use(passport.initialize());

app.get('/', (req, res) => {
    console.log('hellooo')
    res.send('Hello world');
})

app.use('/user', userRouter);
app.use('/memo', memoRouter);
app.use('/folder', folderRouter);


app.listen(process.env.PORT, () => {
    console.log(`✅ Listening on at http://localhost:${process.env.PORT}`);
})
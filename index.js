import express from "express";
import dotenv from "dotenv";
import Ydoc from "./src/model/memo";
import cors from "cors";
var bodyParser = require('body-parser');

/* Routers */
import memoRouter from "./src/Router/memoRouter";

import memoRouter from "./src/Router/memoRouter";

dotenv.config();
import "./src/db";

const app = express();
const PORT = process.env.PORT || 33333;

/* 미들웨어 */
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* 메모 생성
    메모 수정
    메모 삭제
    메조 저장
    멤버 초대
    멤버 검색
    내보내기
    회원가입
    프로필
*/
app.use(cors())

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world');
})

app.use('/memo', memoRouter);
// app.use('/user', userRouter);

// app.get('/memo', (req, res) => {
//     console.log("get: memo")
//     // return res.status(200).json({'aewrae': 'asdfasd'})
//     // Ydoc.findById('618bd475a9063a78881ad248')
//     // .exec((error, data) => {
//     //     if (error) return res.status(400).json({error})
//     //     if (data) {
//     //         res.status(200).json({ data })
//     //     }
//     // })
// })

app.listen(PORT, () => {
    console.log(`✅ Listening on at http://localhost:${process.env.PORT}`);
})
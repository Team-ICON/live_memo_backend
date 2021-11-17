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
const session = require('express-session');	//세션관리용 미들웨어

app.use(session({
  httpOnly: true,	//자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
  // secure: true,	//https 환경에서만 session 정보를 주고받도록처리
  secret: 'secret key',	//암호화하는 데 쓰일 키
  resave: false,	//세션을 언제나 저장할지 설정함
  saveUninitialized: true,	//세션이 저장되기 전 uninitialized 상태로 미리 만들어 저장
  cookie: {	//세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
    httpOnly: true,
    Secure: true
  }
}));

// app.all('/*', function(req, res, next) {
//     console.log("/* executed");
//     res.header("Access-Control-Allow-Origin", "*");
//     next();
// });


/* 미들웨어 */
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// google authentication
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    console.log('hellooo')
    res.send('Hello world');
})

app.use('/api/user', userRouter);
app.use('/api/memo', memoRouter);
app.use('/api/folder', folderRouter);


app.listen(process.env.PORT, () => {
    console.log(`✅ Listening on at http://localhost:${process.env.PORT}`);
})
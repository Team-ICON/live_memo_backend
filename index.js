import dotenv from "dotenv";
import Ydoc from "./src/model/memo";
import cors from "cors";
import passport from 'passport';
import webpush from "web-push";

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

/* Routers */
import memoRouter from "./src/Router/memoRouter";
import userRouter from "./src/Router/userRouter";
import folderRouter from "./src/Router/folderRouter";
import pushRouter from "./src/Router/pushRouter";

dotenv.config();
import "./src/db";

const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
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

/* 미들웨어 */
app.use(cors());

app.use(cookieParser());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
app.use('/api/push', pushRouter);


io.on('connection', function (socket) {
  console.log('a user connected');


  socket.on('newUser', ((email) => {
    socket.broadcast.emit('newUser', email)
  }))

});



server.listen(process.env.PORT, () => {
  console.log(`✅ Listening on at http://localhost:${process.env.PORT}`);
})

// don't delete this comment, - heroku addons:open papertrail
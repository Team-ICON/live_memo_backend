
import { v4 } from 'uuid';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2');
const jwt = require('jsonwebtoken');
let mongoose = require('mongoose');
const User = mongoose.model('User');
import session from "express-session";

require('dotenv').config();

passport.use(
    new GoogleStrategy(
        {
            // options for strategy
            callbackURL: `https://livememo-backend.herokuapp.com/api/user/auth/google/callback/`,
            // callbackURL: `http://localhost:4000/api/user/auth/google/callback/`,
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.email;
            const profileName = profile.displayName;
            const picture = profile.picture;
            // check if user already exists
            const currentUser = await User.findOne({ email: email });
            if (currentUser) {
                // already have the user -> return (login)
                return done(null, currentUser);
            } else {
                // register user and return
                const newUser = await new User({ _id: v4(), email: email, profileName: profileName, picture: picture }).save();
                return done(null, newUser);
            }
        }
    )
);


// Issue Token
export const signToken = async (req, res) => {
    console.log(`req.user`, req.user);
    jwt.sign({ email: req.user.email, profileName: req.user.profileName, _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30 day' }, (err, token) => {
        if (err) {
            return res.sendStatus(500);
        } else {
            try {
                res.cookie('livememo-token', token, { httpOnly:false, secure: false });
                console.log('token json send');
                res.redirect(`https://livememo-frontend.web.app`);
                // return res.status(200).json({ token });
                // req.session.livememo = token;
                // res.cookie('livememo-token', token);
                // console.log(`redirect gogo`);
                // res.redirect(`http://localhost:3000/`);
            } catch (err) {
                console.log(`err`, err)
            }
            // return res.status(200).json({token});
        }
        // res.redirect(`http://localhost:3000/${token}`);
    });
}

export const isLoggedin = async (req, res, next) => {
    try {
        // client에서 request header에 authorization항목에 토큰 넣어준다고 가정했습니다
        if (req.headers.authorization) {
            let token = req.headers.authorization.split(" ")[1];
            const userInfoToken = await jwt.verify(token, process.env.JWT_SECRET);

            // 토큰이 유효하지 않은 경우
            if (!userInfoToken) {
                return res.status(400).json({ "message": "unautorized token!" });
            }

            // req.user항목에 토큰에서 해독한 유저 정보를 넣어서 넘깁니다
            req.user = userInfoToken;
        } else {
            return res.status(400).json({ "message": "Need to Login for this content" })
        }
    } catch (err) {
        console.log(err);
        console.log("err at Middleware");
        return res.status(400).json({ "message": "Login Error at middlewares" });
    }
    next();
}
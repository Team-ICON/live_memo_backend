import express from "express";

// google authentication
import passport from "passport";
import "../Services/AuthService";
import { signToken, isLoggedin } from "../Services/AuthService";
import { getUserInfo, setFcmToken } from "../Controller/userController";

const router = express.Router();

router.get('/userinfo', isLoggedin, getUserInfo);
router.put('/userFcmToken', isLoggedin, setFcmToken);

router.get('/auth/google',
  passport.authenticate('google', { scope: ["profile", "email"] })
);

// callback url upon successful google authentication
router.get('/auth/google/callback/', passport.authenticate('google', {
  session: false, failureRedirect: '/user/auth/google'
}), signToken);


export default router;
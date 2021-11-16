
import express from "express";
// google authentication
const passport = require('passport');
// require("../Services/AuthService");
import "../Services/AuthService";


import { loginUser, loginCallback } from "../Controller/userController";

const router = express.Router();

router.get('/hello', 
    (req, res) => {
        console.log('overhere')
    }
);
  

router.get('/auth/google', 
    passport.authenticate('google', {scope: ["profile", "email"]})
);
  
  // callback url upon successful google authentication
router.get('/auth/google/callback/', passport.authenticate('google', {
    session: false, successRedirect:'/', failureRedirect : '/user/auth/google'
}), 
(req, res, next) => {
    authService.signToken(req, res);
    // signToken(req, res);
});


// router.get('/verify', verifyUser);

export default router;
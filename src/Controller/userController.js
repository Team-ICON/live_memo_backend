const passport = require('passport');
require("../Services/AuthService");

import { userLogin } from "../Services/AuthService";


export const loginUser = (req, res, next) => {
    console.log("this is loginUser function!");
    userLogin();
    // passport.authenticate('google', {scope: ["profile", "email"]})(req, res, nex);
};

export const loginCallback = (req, res) => {
    passport.authenticate('google', {
        session: false, successRedirect:'/', failureRedirect : '/user/auth/google'
    }), 
    (req, res, next) => {
        authService.signToken(req, res);
        // signToken(req, res);
    }
};


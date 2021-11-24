import express from "express";

import {
    createPush,
    savePush,
} from "../Controller/pushController";

import { isLoggedin } from "../Services/AuthService";

const router = express.Router();

router.post("/createPush", isLoggedin, createPush);
// router.put("/savePush", isLoggedin, savePush);




export default router;
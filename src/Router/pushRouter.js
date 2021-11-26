import express from "express";

import {
    createPush,
    savePush,
    testPush
} from "../Controller/pushController";

import { isLoggedin } from "../Services/AuthService";
import { fcmTokenList } from "../Controller/pushController";

const router = express.Router();

router.post("/fcmTokenList", isLoggedin, fcmTokenList);




export default router;
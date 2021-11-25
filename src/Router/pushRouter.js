import express from "express";

import {
    createPush,
    savePush,
    testPush
} from "../Controller/pushController";

import { isLoggedin } from "../Services/AuthService";

const router = express.Router();

router.post("/createPush", isLoggedin, createPush);
router.post("/test", isLoggedin, testPush);

// router.put("/savePush", isLoggedin, savePush);




export default router;
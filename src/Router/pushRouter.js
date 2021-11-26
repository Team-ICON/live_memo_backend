import express from "express";

import { isLoggedin } from "../Services/AuthService";
import { fcmTokenList } from "../Controller/pushController";

const router = express.Router();

router.post("/fcmTokenList", isLoggedin, fcmTokenList);



export default router;
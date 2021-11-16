import express from "express";

import { createMemo,
    deleteMemo,
    saveMemo,
    showMemo } from "../Controller/memoController";

import { isLoggedin } from "../Services/AuthService";

const router = express.Router();

router.post("/create", createMemo);
router.post("/delete", deleteMemo);
router.post("/save", saveMemo);
router.get("/show", showMemo);

// router.post("/create", isLoggedin, createMemo);
// router.post("/delete", isLoggedin, deleteMemo);
// router.post("/save", isLoggedin, saveMemo);
// router.get("/show", isLoggedin, showMemo);


export default router;
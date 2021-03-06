import express from "express";

import { createFolder,
    deleteFolder,
    moveFolder,
    showFolder,
    showMemosInFolder } from "../Controller/folderController";

import { isLoggedin } from "../Services/AuthService";

const router = express.Router();

router.post("/create", isLoggedin, createFolder);
router.post("/delete", isLoggedin, deleteFolder);
router.post("/move", isLoggedin, moveFolder);
router.get("/show", isLoggedin, showFolder);

router.post("/open", isLoggedin, showMemosInFolder); // 특정 폴더 메모 리스트 전체 뜨는 것


export default router;
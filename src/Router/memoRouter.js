import express from "express";

import {
    createMemo,
    deleteMemo,
    saveMemo,
    showMemos,
    addBookmark,
    removeBookmark,
    viewMemo,
    addUser,
    getCurUser,
    afterCurUser
} from "../Controller/memoController";

import { isLoggedin } from "../Services/AuthService";

const router = express.Router();

router.put("/createMemo", isLoggedin, createMemo);
router.post("/delete", isLoggedin, deleteMemo);
router.post("/save", isLoggedin, saveMemo);
router.post("/addbookmark", isLoggedin, addBookmark);
router.post("/removebookmark", isLoggedin, removeBookmark);
router.post("/addUser", isLoggedin, addUser);
router.post("/getCurUser", isLoggedin, getCurUser);
router.post("/afterCurUser", isLoggedin, afterCurUser);

router.get("/getMemos", isLoggedin, showMemos); // main에 메모리스트 전체 뜨는 것
router.get("/getMemo/:id", isLoggedin, viewMemo); // 하나의 메모 조회

// router.put("/createMemo", createMemo);

// router.post("/addUser", addUser);
// router.get("/getMemo/:id", viewMemo); // 하나의 메모 조회
// router.get("/getMemos", showMemos); // main에 메모리스트 전체 뜨는 것
// router.post("/addUser", addUser);
// router.post("/delete", isLoggedin, deleteMemo);
// router.post("/save", isLoggedin, saveMemo);
// router.get("/show", isLoggedin, showMemo);


export default router;
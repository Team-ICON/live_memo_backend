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
    leaveRoom,
    getUserListOfMemo,
} from "../Controller/memoController";

import { isLoggedin } from "../Services/AuthService";

const router = express.Router();

router.put("/createMemo", isLoggedin, createMemo);
router.post("/delete", isLoggedin, deleteMemo);
// router.post("/save", isLoggedin, saveMemo);
router.post("/addbookmark", isLoggedin, addBookmark);
router.post("/removebookmark", isLoggedin, removeBookmark);
router.post("/addUser", isLoggedin, addUser);

router.post("/leaveRoom", isLoggedin, leaveRoom);
router.get("/getMemos", isLoggedin, showMemos); // main에 메모리스트 전체 뜨는 것
router.get("/getMemos/:folder", isLoggedin, showMemos); // 특정 폴더 메모 리스트 전체 뜨는 것
router.get("/getMemo/:id", isLoggedin, viewMemo); // 하나의 메모 조회
router.get("/getUserListOfMemo/:id", isLoggedin, getUserListOfMemo);



export default router;
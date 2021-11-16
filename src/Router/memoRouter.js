import express from "express";

import { createMemo,
    deleteMemo,
    saveMemo,
    showMemo,
    addBookmark,
    removeBookmark,
    viewMemo,
    checkBookmark
 } from "../Controller/memoController";

const router = express.Router();

router.post("/create", createMemo);
router.post("/delete", deleteMemo);
router.post("/save", saveMemo);
router.post("/addbookmark", addBookmark);
router.post("/removebookmark", removeBookmark);

router.get("/show", showMemo); // main에 메모리스트 전체 뜨는 것
router.get("/view", viewMemo); // 하나의 메모 조회

export default router;
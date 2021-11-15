import express from "express";

import { createMemo,
    deleteMemo,
    saveMemo,
    showMemo,
    addBookmark,
    removeBookmark,
    checkBookmark
 } from "../Controller/memoController";

const router = express.Router();

router.post("/create", createMemo);
router.post("/delete", deleteMemo);
router.post("/save", saveMemo);
router.post("/addbookmark", addBookmark);
router.post("/removebookmark", removeBookmark);

router.get("/show", showMemo);

export default router;
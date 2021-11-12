import express from "express";

import { createMemo,
    deleteMemo,
    saveMemo,
    showMemo } from "../Controller/memoController";

const router = express.Router();

router.get("/show", showMemo);
router.post("/create", createMemo);
router.post("/delete", deleteMemo);
router.post("/save", saveMemo);

export default router;
import express from "express";

import { createMemo,
    deleteMemo,
    saveMemo,
    updateMemo } from "../Controller/memoController";

const router = express.Router();

router.post("/add", createMemo);
router.post("/update", updateMemo);
router.post("/delete", deleteMemo);
router.post("/export", saveMemo);

export default router;
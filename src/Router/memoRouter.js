import express from "express";

import { createMemo,
    deleteMemo,
    exportMemo,
    updateMemo } from "../Controller/memoController";

const router = express.Router();

router.post("/add",createMemo);
router.post("/update", updateMemo);
router.delete("/delete", deleteMemo);
router.get("/export", exportMemo);

export default router;
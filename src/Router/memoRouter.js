import express from "express";

import { createMemo,
    deleteMemo,
    saveMemo,
    showMemo } from "../Controller/memoController";

const router = express.Router();

router.post("/create", createMemo);
router.post("/delete", deleteMemo);
router.post("/save", saveMemo);
router.get("/show", showMemo);

export default router;
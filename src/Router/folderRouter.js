import express from "express";

import { createFolder,
    deleteFolder,
    moveFolder,
    showFolder } from "../Controller/folderController";

const router = express.Router();

router.post("/create", createFolder);
router.post("/delete", deleteFolder);
router.post("/move", moveFolder);
router.get("/show", showFolder);

export default router;
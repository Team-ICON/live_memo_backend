import express from "express";

import { createFolder,
    deleteFolder,
    moveFolder,
    showFolder } from "../Controller/folderController";

import { isLoggedin } from "../Services/AuthService";

const router = express.Router();

router.post("/create", isLoggedin, createFolder);
router.post("/delete", isLoggedin, deleteFolder);
router.post("/move", isLoggedin, moveFolder);
router.get("/show", isLoggedin, showFolder);

// router.post("/create", createFolder);
// router.post("/delete", deleteFolder);
// router.post("/move", moveFolder);
// router.get("/show", showFolder);
// router.post("/create", isLoggedin, createFolder);
// router.post("/delete", isLoggedin, deleteFolder);
// router.post("/move", isLoggedin, moveFolder);
// router.get("/show", isLoggedin, showFolder);


export default router;
import express from "express";
import { addfolder } from "../Controller/folderController";

const router = express.Router();

router.get("/add", addfolder);


export default router;
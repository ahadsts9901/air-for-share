import { Router } from "express";
import { getFilesController, getTextController, removeFileController, removeTextController, sendFilesController, sendTextController } from "../controllers/sharingControllers.mjs";

const router = Router()

router.get("/text", getTextController)
router.post("/text", sendTextController)
router.delete("/text", removeTextController)

router.get("/files", getFilesController)
router.post("/files", sendFilesController)
router.delete("/files/:docId", removeFileController)

export default router
import { Router } from "express";
import { downloadFilecontroller, getFilesController, getTextController, removeFileController, removeTextController, sendFilesController, sendTextController } from "../controllers/sharingControllers.mjs";
import { upload } from "../utils/multer.mjs";

const router = Router()

router.get("/text", getTextController)
router.post("/text", sendTextController)
router.delete("/text", removeTextController)

router.get("/files", getFilesController)
router.post("/files", upload.any(), sendFilesController)
router.delete("/files/:docId", removeFileController)

router.post("/download", downloadFilecontroller)

export default router
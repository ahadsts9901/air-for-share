import { Router } from "express";
import { autoDeleteFilesController, downloadFilecontroller, getFilesController, getTextController, removeFileController, removeTextController, sendFilesController, sendTextController } from "../controllers/sharingControllers.mjs";
import { upload } from "../utils/multer.mjs";

const router = Router()

router.get("/download", downloadFilecontroller)
router.delete("/files", autoDeleteFilesController)

router.get("/text", getTextController)
router.post("/text", sendTextController)
router.delete("/text", removeTextController)

router.get("/files", getFilesController)
router.post("/files", upload.any(), sendFilesController)
router.delete("/files/:docId", removeFileController)


export default router
import { Router } from "express";
import { getTextController, removeTextController, sendTextController } from "../controllers/sharingControllers.mjs";

const router = Router()

router.delete("/text", removeTextController)
router.post("/text", sendTextController)
router.get("/text", getTextController)

export default router
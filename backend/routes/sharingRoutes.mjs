import { Router } from "express";
import { getTextController, sendTextController } from "../controllers/sharingControllers.mjs";

const router = Router()

router.post("/text", sendTextController)
router.get("/text", getTextController)

export default router
import { Router } from "express";
import { sendTextController } from "../controllers/sharingControllers.mjs";

const router = Router()

router.post("/text", sendTextController)

export default router
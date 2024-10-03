import { Router } from "express";
import { getFilesController } from "../controllers/sharingControllers.mjs";

const router = Router()

router.get("/files", getFilesController)

export default router
import { Route } from "express";
import { getFilesController } from "../controllers/sharingControllers.mjs";

const router = Route()

router.get("/files", getFilesController)

export default router
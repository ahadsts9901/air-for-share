import fs from "fs"
import path from "path"
import { __dirname } from "../server.mjs"

export const removeFileFromPath = async (filePath) => {
    try {
        const fullPath = path.resolve(__dirname, filePath);
        await fs.promises.unlink(fullPath);
    } catch (error) {
        console.error(error);
    }
}
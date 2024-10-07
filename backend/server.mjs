import "dotenv/config"
import "./utils/db.mjs"
import express, { json } from "express"
import morgan from "morgan"
import cors from "cors"
import { allowedOrigins } from "./utils/core.mjs"
import path from "path"

import sharingRoutes from "./routes/sharingRoutes.mjs"
export const __dirname = path.resolve()

const app = express()

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(json())
app.use(morgan("dev"))

app.use("/api/v1", sharingRoutes)

const PORT = process.env.PORT || 5002

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
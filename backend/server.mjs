import "dotenv/config"
import "./utils/db.mjs"
import express, { json } from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"
import { createServer } from "http"
import { Server as socketIo } from "socket.io"
import { allowedOrigins, globalIoObject } from "./utils/core.mjs"

import sharingRoutes from "./routes/sharingRoutes.mjs"

const app = express()

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use("/api/v1", sharingRoutes)

// socket io
const server = createServer(app)
const io = new socketIo(server, { cors: { origin: allowedOrigins, methods: "*" } })
globalIoObject.io = io
io.on("connection", (socket) => console.log(`new client connected with id: ${socket?.id}`))

const PORT = process.env.PORT || 5002

server.listen(PORT, () => console.log(`server is running on port ${PORT}`))
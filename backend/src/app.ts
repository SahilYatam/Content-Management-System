import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}
import express from "express";
import type { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import {
    errorHandler,
    notFoundHandler,
} from "./middlewares/globalErrorHandler.js";

import { userRouter } from "./modules/user/user.routes.js";
import { sessionRouter } from "./modules/session/session.routes.js";

export const app = express();

app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }),
);
app.use(morgan("dev"));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});

app.get("/health", (req: Request, res: Response) => {
    return res.status(200).json({ status: "OK" });
});

function limiter(windowMs: number, max: number) {
    return rateLimit({
        windowMs,
        max,
        message: "Too many requests, please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
    });
}

const globalRateLimiting = limiter(15 * 60 * 1000, 1000); // 15 minutes, 1000 requests
app.use(globalRateLimiting);

app.use("/api/user", userRouter);
app.use("/api/session", sessionRouter);

app.get("/api/v1/test", (req, res) => {
    res.json({
        success: true,
        message: "Test route is reachable",
    });
});

app.use(notFoundHandler);
app.use(errorHandler);

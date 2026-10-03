import "dotenv/config";

import http from "node:http";
import mongoose from "mongoose";

import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { logger } from "./shared/index.js";

const PORT = Number(process.env.PORT) || 8015;
const SHUTDOWN_TIMEOUT = 10_000;

let server: http.Server | null = null;
let isShuttingDown = false;

const gracefulShutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) {
        logger.info("Shutdown already in progress, ignoring signal");
        return;
    }

    isShuttingDown = true;

    logger.info(`🛑 Shutting down (${signal})...`);

    const shutdownTimer = setTimeout(() => {
        logger.error("🚨 Force shutdown after timeout");
        process.exit(1);
    }, SHUTDOWN_TIMEOUT);

    try {
        // Stop accepting new HTTP connections
        if (server) {
            await new Promise<void>((resolve, reject) => {
                server?.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });

            logger.info("🌐 HTTP server closed");
        }

        // Close MongoDB connection
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            logger.info("🔌 MongoDB connection closed");
        }

        clearTimeout(shutdownTimer);

        logger.info("✅ Shutdown complete");
        process.exit(0);
    } catch (error: unknown) {
        clearTimeout(shutdownTimer);

        if (error instanceof Error) {
            logger.error(`❌ Error during shutdown: ${error.message}`, {
                stack: error.stack,
            });
        } else {
            logger.error("❌ Unknown error during shutdown");
        }

        process.exit(1);
    }
};

const handleFatalError = async (type: string, error: Error): Promise<void> => {
    if (isShuttingDown) {
        return;
    }

    logger.error(`🚨 ${type.toUpperCase()} Error: ${error.message}`, {
        stack: error.stack,
    });

    await gracefulShutdown(type);
};

process.on("uncaughtException", (error: Error) => {
    void handleFatalError("uncaughtException", error);
});

process.on("unhandledRejection", (reason: unknown) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));

    void handleFatalError("unhandledRejection", error);
});

process.once("SIGINT", () => {
    void gracefulShutdown("SIGINT");
});

process.once("SIGTERM", () => {
    void gracefulShutdown("SIGTERM");
});

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        server = app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`);
        });

        server.on("error", (error: Error) => {
            void handleFatalError("server", error);
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`❌ Failed to start server: ${error.message}`, {
                stack: error.stack,
            });
        } else {
            logger.error("❌ Failed to start server with unknown error");
        }

        await gracefulShutdown("startup_failure");
    }
};

void startServer();

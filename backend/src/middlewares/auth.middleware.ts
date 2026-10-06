import { verifyAccessToken } from "../modules/session/verifyAccessToken.js";
import { logger } from "../shared/index.js";
import { Request, Response, NextFunction } from "express";

export const authentication = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const token = req.cookies?.accessToken ?? null;
        const authContext = await verifyAccessToken(token ?? "");

        req.user = authContext.user;
        next();
    } catch (error) {
        logger.warn("HTTP authentication failed", {
            path: req.path,
            ip: req.ip,
        });

        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
};

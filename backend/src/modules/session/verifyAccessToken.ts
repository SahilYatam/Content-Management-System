import jwt, { JwtPayload } from "jsonwebtoken";
import { userRepo, UserSummary } from "../user/user.repository.js";
import { ApiError, logger } from "../../shared/index.js";

export interface AuthJwtPayload extends JwtPayload {
    userId?: unknown;
}

export interface AuthContext {
    userId: string;
    user: UserSummary;
}

export const verifyAccessToken = async (
    accessToken: string,
): Promise<AuthContext> => {
    if (!accessToken) {
        throw new ApiError(401, "Unauthorized");
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
        logger.error("ACCESS_TOKEN_SECRET is not configured");

        throw new Error("Server misconfiguration");
    }

    let decoded: AuthJwtPayload;

    try {
        const result = jwt.verify(accessToken, secret, {
            issuer: "cms",
            audience: "user",
        });

        if (typeof result !== "object" || result === null) {
            throw new Error("Invalid JWT payload");
        }

        decoded = result as AuthJwtPayload;
    } catch {
        throw new ApiError(401, "Unauthorized");
    }

    if (typeof decoded.userId !== "string" || !decoded.userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const user = await userRepo.findUserById(decoded.userId);

    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    if (user.status !== "active") {
        throw new ApiError(401, "Unauthorized");
    }

    return {
        userId: decoded.userId,
        user,
    };
};

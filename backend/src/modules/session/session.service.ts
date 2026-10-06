import { Types } from "mongoose";

import { ApiError, logger } from "../../shared/index.js";
import { USER_STATUS } from "../user/user.model.js";
import { userRepo } from "../user/user.repository.js";

import { generateAccessAndRefreshToken, hashToken } from "./jwt.js";

import { CreateSessionInput, sessionRepo } from "./session.repository.js";

type AuthTokens = {
    accessToken: string;
    rawRefreshToken: string;
};

const createSession = async (userId: Types.ObjectId): Promise<AuthTokens> => {
    try {
        const {
            accessToken,
            refreshToken: rawRefreshToken,
            expiresAt,
        } = generateAccessAndRefreshToken(userId.toString());

        const refreshTokenHash = hashToken(rawRefreshToken);

        const session = await sessionRepo.createSession({
            userId,
            refreshTokenHash,
            expiresAt,
        });

        logger.info(
            `Session created | user: ${userId} | sessionId: ${session._id}`,
        );

        return {
            accessToken,
            rawRefreshToken,
        };
    } catch (error) {
        logger.error(`Failed creating session for user ${userId}`, { error });

        throw error;
    }
};

const getSessionByRefreshToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new ApiError(401, "Unauthorized");
    }

    const hashedToken = hashToken(refreshToken);

    const session =
        await sessionRepo.findSessionByRefreshTokenHash(hashedToken);

    if (!session) {
        throw new ApiError(401, "Unauthorized");
    }

    if (session.revokedAt) {
        throw new ApiError(401, "Unauthorized");
    }

    if (session.expiresAt.getTime() <= Date.now()) {
        throw new ApiError(401, "Unauthorized");
    }

    return session;
};

const refreshAccessToken = async (
    refreshToken: string,
): Promise<AuthTokens> => {
    const session = await getSessionByRefreshToken(refreshToken);

    const user = await userRepo.findUserById(session.userId);

    if (!user || user.status !== USER_STATUS.ACTIVE) {
        throw new ApiError(401, "Unauthorized");
    }

    const {
        accessToken,
        refreshToken: rawRefreshToken,
        expiresAt,
    } = generateAccessAndRefreshToken(session.userId.toString());

    const newRefreshTokenHash = hashToken(rawRefreshToken);

    const updatedSession = await sessionRepo.updateSession(session._id, {
        refreshTokenHash: newRefreshTokenHash,
        expiresAt,
        revokedAt: null,
    });

    if (!updatedSession) {
        throw new ApiError(401, "Unauthorized");
    }

    logger.info(
        `Session refreshed | user: ${session.userId} | sessionId: ${session._id}`,
    );

    return {
        accessToken,
        rawRefreshToken,
    };
};

export const sessionService = {
    createSession,
    getSessionByRefreshToken,
    refreshAccessToken,
};

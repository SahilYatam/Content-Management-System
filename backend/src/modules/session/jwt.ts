import crypto from "crypto";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_BYTES = 32;
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

export const generateToken = (): string => {
    return crypto.randomBytes(REFRESH_TOKEN_BYTES).toString("hex");
};

export const hashToken = (rawToken: string): string => {
    return crypto.createHash("sha256").update(rawToken).digest("hex");
};

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
}

export const generateAccessAndRefreshToken = (userId: string): AuthTokens => {
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

    const accessToken = jwt.sign({ userId }, secret, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
        issuer: "cms",
        audience: "user",
    });

    const refreshToken = generateToken();

    const expiresAt = new Date(
        Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    );

    return {
        accessToken,
        refreshToken,
        expiresAt,
    };
};

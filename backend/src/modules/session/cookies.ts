import { Response } from "express";

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;

const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const getSameSite = () => {
    const isProduction = process.env.NODE_ENV === "production";

    return isProduction ? ("none" as const) : ("lax" as const);
};

export const setCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string,
): void => {
    const isProduction = process.env.NODE_ENV === "production";

    const sameSite = getSameSite();

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite,
        maxAge: ACCESS_TOKEN_MAX_AGE,
        path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite,
        maxAge: REFRESH_TOKEN_MAX_AGE,
        path: "/",
    });
};

export const clearCookies = (res: Response): void => {
    const isProduction = process.env.NODE_ENV === "production";

    const sameSite = getSameSite();

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite,
        path: "/",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite,
        path: "/",
    });
};

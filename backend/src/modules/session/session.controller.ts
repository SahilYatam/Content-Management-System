import { Request, Response } from "express";
import { asyncHandler, ApiResponse } from "../../shared/index.js";
import { setCookies } from "../session/cookies.js";
import { sessionService } from "../session/session.service.js";

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const { accessToken, rawRefreshToken } =
        await sessionService.refreshAccessToken(refreshToken);

    setCookies(res, accessToken, rawRefreshToken);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Access token refreshed successfully!"));
});

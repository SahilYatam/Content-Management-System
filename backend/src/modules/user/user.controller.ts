import { Request, Response } from "express";
import { asyncHandler, ApiResponse } from "../../shared/index.js";
import { setCookies, clearCookies } from "../session/cookies.js";
import { userService } from "./user.service.js";
import { sessionService } from "../session/session.service.js";

const getUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const user = await userService.getUser(userId);

    return res
        .status(200)
        .json(
            new ApiResponse(20, { user }, "User details fetched Successful!"),
        );
});

const geAlltUser = asyncHandler(async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();

    return res
        .status(200)
        .json(new ApiResponse(20, { users }, "All users fetched Successful!"));
});

const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await userService.login(email, password);

    const { accessToken, rawRefreshToken } = await sessionService.createSession(
        user._id,
    );

    setCookies(res, accessToken, rawRefreshToken);

    return res
        .status(201)
        .json(new ApiResponse(201, { user }, "Login Successful!"));
});

const signUp = asyncHandler(async (req: Request, res: Response) => {
    const { name, username, email, password } = req.body;
    const user = await userService.signUp({
        name,
        username,
        email,
        passwordHash: password,
    });

    const { accessToken, rawRefreshToken } = await sessionService.createSession(
        user._id,
    );

    setCookies(res, accessToken, rawRefreshToken);

    return res
        .status(201)
        .json(new ApiResponse(201, { user }, "Signup Successful!"));
});

const logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const { message } = await userService.logout(refreshToken);

    clearCookies(res);

    return res.status(200).json(new ApiResponse(200, {}, message));
});

export const userController = {
    getUser,
    geAlltUser,
    login,
    signUp,
    logout,
};

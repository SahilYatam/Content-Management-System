import { ApiError } from "../../shared/index.js";
import {
    comparePassword,
    hashPassword,
} from "../../shared/utils/password.utils.js";
import { hashToken } from "../session/jwt.js";
import { sessionRepo } from "../session/session.repository.js";
import { USER_STATUS } from "./user.model.js";
import { UserAuth, UserInput, userRepo } from "./user.repository.js";

type PublicUser = Pick<
    UserAuth,
    "_id" | "name" | "username" | "email" | "role" | "status"
>;

const toPublicUser = (user: UserAuth): PublicUser => ({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
});

const login = async (email: string, password: string) => {
    const user = await userRepo.findUserForLogin(email.toLowerCase().trim());

    if (!user) {
        throw new ApiError(404, "User not found!");
    }

    const isPasswordCorrect = comparePassword(password, user.passwordHash);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials!");
    }

    if (user.status !== USER_STATUS.ACTIVE) {
        throw new ApiError(403, "Account is suspended!");
    }

    return toPublicUser({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        status: user.status,
    });
};

const signUp = async (data: UserInput) => {
    const email = data.email.trim().toLowerCase();

    const exists = await userRepo.userExistsByEmail(email);

    if (exists) {
        throw new ApiError(403, "User already exist!");
    }

    const hasehdPassword = hashPassword(data.passwordHash);

    const user = await userRepo.createUser({
        name: data.name,
        username: data.username,
        email: data.email,
        passwordHash: (await hasehdPassword).toString(),
    });

    return toPublicUser({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        status: user.status,
    });
};

const logout = async (refreshToken: string) => {
    const token = hashToken(refreshToken);
    const session = await sessionRepo.revokeSessionByHashedToken(token);

    if (!session) {
        throw new ApiError(403, "Unauthorized request");
    }

    return { message: "Logout Successful" };
};

export const userService = {
    login,
    signUp,
    logout,
};

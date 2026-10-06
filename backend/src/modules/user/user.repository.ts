import { Types } from "mongoose";
import { IUser, User, UserDocument } from "./user.model.js";

export type UserLean = IUser & {
    _id: Types.ObjectId;
};

export type UserSummary = Pick<
    UserLean,
    "_id" | "name" | "username" | "email" | "role" | "status"
>;

export type UserAuth = Pick<
    UserLean,
    "_id" | "name" | "username" | "email" | "passwordHash" | "role" | "status"
>;

export type UserInput = {
    name: string;
    username: string;
    email: string;
    passwordHash: string;
};

const findUserForLogin = async (email: string): Promise<UserAuth | null> => {
    return User.findOne({ email })
        .select("_id name username email passwordHash role status")
        .lean<UserAuth>()
        .exec();
};

const userExistsByEmail = async (email: string): Promise<boolean> => {
    const user = await User.exists({ email });

    return Boolean(user);
};

const findUserByUsername = async (
    username: string,
): Promise<UserAuth | null> => {
    return User.findOne({ username }).lean<UserAuth>().exec();
};

const findUserById = async (
    id: string | Types.ObjectId,
): Promise<UserSummary | null> => {
    return User.findById(id)
        .select("name username email role")
        .lean<UserSummary>()
        .exec();
};

const findAllUsers = async (): Promise<UserSummary[]> => {
    return User.find()
        .sort({ createdAt: -1 })
        .select("name username email role status")
        .lean<UserSummary[]>()
        .exec();
};

const createUser = async (input: UserInput): Promise<UserDocument> => {
    return User.create(input);
};

const updateUserDisplayName = async (
    id: string | Types.ObjectId,
    name: string,
): Promise<UserDocument | null> => {
    return User.findByIdAndUpdate(
        id,
        { name },
        { new: true, runValidators: true },
    ).exec();
};

export const userRepo = {
    findUserForLogin,
    userExistsByEmail,
    findUserByUsername,
    findUserById,
    findAllUsers,
    createUser,
    updateUserDisplayName,
};

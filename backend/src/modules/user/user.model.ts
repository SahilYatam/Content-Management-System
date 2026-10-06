import { Schema, model, HydratedDocument } from "mongoose";

export const USER_ROLE = {
    MEMBER: "member",
    EDITOR: "editor",
    ADMIN: "admin",
} as const;
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USER_STATUS = {
    ACTIVE: "active",
    SUSPENDED: "suspended",
} as const;
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export interface IUser {
    name: string;
    username: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        }, 
        
        username: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        passwordHash: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: Object.values(USER_ROLE),
            default: USER_ROLE.MEMBER,
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(USER_STATUS),
            default: USER_STATUS.ACTIVE,
            required: true,
        },
    },
    { timestamps: true },
);

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

export const User = model<IUser>("User", userSchema);

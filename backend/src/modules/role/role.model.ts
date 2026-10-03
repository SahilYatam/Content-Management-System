import { HydratedDocument, model, Schema, Types } from "mongoose";
import { USER_ROLE, UserRole } from "../user/user.model.js";

export const REQUESTED_ROLE_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
} as const;

export type RequestedRoleStatus =
    (typeof REQUESTED_ROLE_STATUS)[keyof typeof REQUESTED_ROLE_STATUS];

export interface IRole {
    userId: Types.ObjectId;
    requestedRole: UserRole;
    reason: string;
    status: RequestedRoleStatus;
    reviewedAt: Date | null;
    reviewedBy: Types.ObjectId;
    reviewReason: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export type RoleDocument = HydratedDocument<IRole>;

const roleSchema = new Schema<IRole>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        requestedRole: {
            type: String,
            enum: Object.values(USER_ROLE),
            required: true,
        },

        reason: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: Object.values(REQUESTED_ROLE_STATUS),
            default: REQUESTED_ROLE_STATUS.PENDING,
            required: true,
        },

        reviewedAt: {
            type: Date,
            default: null,
        },

        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        reviewReason: {
            type: String,
            default: null,
            trim: true,
        },
    },
    { timestamps: true },
);

roleSchema.index({ userId: 1 });
roleSchema.index({ status: 1, createdAt: -1 });

export const Role = model<IRole>("Role", roleSchema);

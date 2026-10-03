import { Schema, model, HydratedDocument, Types } from "mongoose";

export interface ISession {
    userId: Types.ObjectId;
    refreshTokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type SessionDocument = HydratedDocument<ISession>;

const sessionSchema = new Schema<ISession>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        refreshTokenHash: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true
        },

        revokedAt: {
            type: Date,
            default: null
        },
    },
    { timestamps: true },
);

sessionSchema.index({ refreshTokenHash: 1 }, { unique: true });

export const Session = model<ISession>("Session", sessionSchema);
